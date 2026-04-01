"""Knowledge Base API — RAG document management and retrieval."""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from src.core.database import get_db
from src.models.db_models import KnowledgeDocumentDB

router = APIRouter()


class KnowledgeDocument(BaseModel):
    doc_id: str
    title: str
    source: str
    category: str
    chunk_count: int
    status: str
    uploaded_at: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    category: Optional[str] = None


@router.post("/documents", response_model=KnowledgeDocument, status_code=status.HTTP_201_CREATED)
def create_document(payload: KnowledgeDocument, db: Session = Depends(get_db)):
    """Create a new knowledge document entry."""
    existing = db.query(KnowledgeDocumentDB).filter_by(doc_id=payload.doc_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Document ID already exists")
    row = KnowledgeDocumentDB(
        doc_id=payload.doc_id,
        title=payload.title,
        source=payload.source,
        category=payload.category,
        chunk_count=payload.chunk_count,
        status=payload.status,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/documents", response_model=List[KnowledgeDocument])
def list_documents(db: Session = Depends(get_db)):
    """Return all knowledge documents."""
    rows = db.query(KnowledgeDocumentDB).order_by(KnowledgeDocumentDB.created_at.desc()).all()
    return [_to_schema(r) for r in rows]


@router.get("/documents/{doc_id}", response_model=KnowledgeDocument)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    """Return a specific document."""
    row = db.query(KnowledgeDocumentDB).filter_by(doc_id=doc_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found")
    return _to_schema(row)


@router.delete("/documents/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    """Delete a knowledge document."""
    row = db.query(KnowledgeDocumentDB).filter_by(doc_id=doc_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(row)
    db.commit()


@router.post("/search")
def search_knowledge(req: SearchRequest, db: Session = Depends(get_db)):
    """Semantic search over indexed documents (mock RAG)."""
    query = db.query(KnowledgeDocumentDB)
    if req.category:
        query = query.filter(KnowledgeDocumentDB.category.ilike(req.category))
    rows = query.limit(req.top_k).all()
    return {
        "query": req.query,
        "results": [
            {
                "doc_id": r.doc_id,
                "title": r.title,
                "relevance_score": round(0.95 - i * 0.08, 2),
                "excerpt": f"Relevant content from '{r.title}' matching query '{req.query}'...",
            }
            for i, r in enumerate(rows)
        ],
    }


@router.get("/stats")
def knowledge_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    stats = db.query(
        func.count(KnowledgeDocumentDB.doc_id).label("total_documents"),
        func.sum(KnowledgeDocumentDB.chunk_count).label("total_chunks"),
    ).first()
    categories = [c[0] for c in db.query(KnowledgeDocumentDB.category).distinct().all() if c[0]]
    return {
        "total_documents": stats.total_documents or 0,
        "total_chunks": int(stats.total_chunks) if stats.total_chunks else 0,
        "categories": categories,
        "embedding_model": "text-embedding-3-small",
        "vector_store": "ChromaDB",
    }


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    category: str = "general",
    db: Session = Depends(get_db)
):
    """Upload and index a new knowledge document."""
    from shared.utils.uploader import FileHandler
    import uuid
    import os
    
    # Standardize storage path
    storage_dir = os.path.join(os.getcwd(), "storage", "knowledge")
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    save_name = f"{file_id}{ext}"
    
    file_path = await FileHandler.save_upload(file, storage_dir, save_name)
    
    # Create DB entry
    row = KnowledgeDocumentDB(
        doc_id=file_id,
        title=file.filename,
        source=file_path,
        category=category,
        chunk_count=0,  # Async indexing task would update this
        status="indexing",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    
    return {
        "status": "uploaded",
        "message": f"Document '{file.filename}' uploaded and queued for indexing.",
        "document": _to_schema(row)
    }


def _to_schema(row: KnowledgeDocumentDB) -> KnowledgeDocument:
    return KnowledgeDocument(
        doc_id=row.doc_id,
        title=row.title,
        source=row.source or "",
        category=row.category or "",
        chunk_count=row.chunk_count or 0,
        status=row.status or "indexed",
        uploaded_at=row.created_at.isoformat() if row.created_at else "",
    )

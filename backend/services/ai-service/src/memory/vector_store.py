from typing import List, Dict, Any, Optional
import numpy as np


class SimpleVectorStore:
    """
    Lightweight in-memory vector store for embeddings

    Suitable for:
    - Prototyping
    - Small datasets
    - Local semantic search
    """

    def __init__(self):
        self.vectors: List[np.ndarray] = []
        self.metadata: List[Dict[str, Any]] = []

    # -----------------------------
    # ADD EMBEDDINGS
    # -----------------------------
    def add(
        self,
        embedding: List[float],
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Store embedding + metadata
        """
        self.vectors.append(np.array(embedding))
        self.metadata.append(metadata or {})

    # -----------------------------
    # BULK ADD
    # -----------------------------
    def add_many(
        self,
        embeddings: List[List[float]],
        metadatas: Optional[List[Dict[str, Any]]] = None
    ):
        """
        Add multiple embeddings
        """
        for i, emb in enumerate(embeddings):
            meta = metadatas[i] if metadatas else {}
            self.add(emb, meta)

    # -----------------------------
    # COSINE SIMILARITY
    # -----------------------------
    @staticmethod
    def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        return float(
            np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        )

    # -----------------------------
    # SEARCH
    # -----------------------------
    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find most similar embeddings
        """
        if not self.vectors:
            return []

        query = np.array(query_embedding)

        scores = []
        for i, vec in enumerate(self.vectors):
            similarity = self.cosine_similarity(query, vec)
            scores.append((i, similarity))

        # Sort by similarity descending
        scores.sort(key=lambda x: x[1], reverse=True)

        results = []
        for idx, score in scores[:top_k]:
            results.append({
                "score": score,
                "metadata": self.metadata[idx]
            })

        return results

    # -----------------------------
    # CLEAR STORE
    # -----------------------------
    def clear(self):
        self.vectors = []
        self.metadata = []

    # -----------------------------
    # COUNT
    # -----------------------------
    def size(self) -> int:
        return len(self.vectors)
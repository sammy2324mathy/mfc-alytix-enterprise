from fastapi import APIRouter, HTTPException, Query
from typing import List
from src.api.schemas.pricing_schema import PremiumRequest, PremiumResponse, RateProposal, RateProposalCreate, RateProposalStatus
from src.application.services.pricing_service import pricing_service

router = APIRouter()


@router.post("/premium", response_model=PremiumResponse)
def premium(payload: PremiumRequest):
    factor = 1.0 + (payload.age - 30) * 0.01
    if payload.smoker:
        factor += 0.25
    return PremiumResponse(premium=round(payload.base_rate * factor, 2))


@router.get("/proposals", response_model=List[RateProposal])
def get_rate_proposals():
    """Return all rate change proposals."""
    return pricing_service.get_proposals()


@router.post("/proposals", response_model=RateProposal)
def create_rate_proposal(payload: RateProposalCreate):
    """Submit a new rate proposal."""
    return pricing_service.create_proposal(payload)


@router.put("/proposals/{proposal_id}/status", response_model=RateProposal)
def update_proposal_status(proposal_id: str, status: RateProposalStatus = Query(...)):
    """Update the status of a rate proposal (Commit/Reject)."""
    p = pricing_service.update_status(proposal_id, status)
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return p

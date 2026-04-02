from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import random
import time

router = APIRouter()

class ExecutionRequest(BaseModel):
    code: str
    language: str = "python"

class ExecutionResponse(BaseModel):
    job_id: str
    status: str
    stdout: str
    stderr: str = ""
    duration_ms: int

@router.post("/execute", response_model=ExecutionResponse)
def execute_actuarial_modeling_code(req: ExecutionRequest):
    """
    Execute actuarial modeling code.
    Simulates high-performance compute execution on a cluster.
    """
    job_id = f"ACT-EXE-{random.randint(10000, 99999)}"
    start_time = time.time()
    
    # Simple simulation logic
    duration_ms = random.randint(400, 1500)
    
    # Mock some output based on keywords in the code
    code_lower = req.code.lower()
    stdout = f"Job {job_id} initialized on Sovereing Cluster Node 04\n"
    stdout += f"Environment: {req.language.upper()} 3.11\n"
    stdout += "[INFO] Loading MKL libraries for vector compute...\n"
    
    if "mortality" in code_lower:
        stdout += "[OK] Mortality investigation kernel ready.\n"
        stdout += "Convergence: 2.4e-6 at iteration 112\n"
    elif "kaplan" in code_lower:
        stdout += "[OK] Kaplan-Meier estimator initialized.\n"
        stdout += "Confidence Intervals: 95% Normal\n"
    elif "ifrs" in code_lower:
        stdout += "[OK] IFRS 17 GMM Engine active.\n"
        stdout += "CSM Release: Calculating...\n"
    else:
        stdout += f"[AUTO] Compiling AST for high-fidelity modeling...\n"
        stdout += "[OK] Model logic validated. Results calculated.\n"
    
    stdout += f"[DONE] {job_id} completed successfully in {duration_ms}ms.\n"
    
    return ExecutionResponse(
        job_id=job_id,
        status="success",
        stdout=stdout,
        stderr="",
        duration_ms=duration_ms
    )

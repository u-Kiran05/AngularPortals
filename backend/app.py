from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi import FastAPI
from pydantic import BaseModel
import os
# Force GPU
device = 0 if torch.cuda.is_available() else -1

# Load locally saved model
model_path = "./local_models/bart-large-mnli"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

classifier = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer, device=device)

app = FastAPI()
@app.get("/health")
async def health():
    return {"status": "ok"}
@app.post("/shutdown")
async def shutdown():
    print("Shutdown request received.")
    os._exit(0)
class RequestBody(BaseModel):
    message: str

@app.post("/classify")
async def classify(req: RequestBody):
    labels = [
        "employee.open.dashboard", "employee.open.leave", "employee.open.payslip", "employee.email.payslip",
        "customer.open.dashboard", "customer.open.profile", "customer.open.inquiries", "customer.open.deliveries",
        "customer.open.sales", "customer.open.invoices", "customer.download.invoicepdf", "customer.open.aging",
        "customer.open.candd", "customer.open.overallsales", "customer.open.bi",
        "vendor.open.dashboard", "vendor.open.profile", "vendor.open.purchase", "vendor.open.quotation",
        "vendor.open.invoice", "vendor.open.goods", "vendor.open.aging", "vendor.open.candd", "vendor.open.bi"
    ]
    result = classifier(req.message, candidate_labels=labels)
    return {
        "intent": result["labels"][0],
        "confidence": result["scores"][0],
        "all": result
    }

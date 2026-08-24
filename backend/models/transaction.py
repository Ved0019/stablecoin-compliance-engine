from typing import Optional
from pydantic import BaseModel

class TransactionIntent(BaseModel):
    id: str
    sender_name: str
    sender_country: str
    receiver_name: str
    receiver_country: str
    amount_usd: float
    iso_postal_code: Optional[str] = None
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from app.database import Base

class UserNotification(Base):
    __tablename__ = "UserNotifications"

    UserID = Column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    User = Column(String(255), nullable=False)

    NotificationType = Column(String(255))
    BusinessGroupName = Column(String(255))
    BusinessUnitName = Column(String(255))
    CountryName = Column(String(255))
    PlantName = Column(String(255))
    ListType = Column(String(255))

    CreatedDate = Column(DateTime, default=datetime.utcnow)
    ModifiedDate = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)




from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class NotificationBase(BaseModel):
    User: str
    NotificationType: Optional[str] = None
    BusinessGroupName: Optional[str] = None
    BusinessUnitName: Optional[str] = None
    CountryName: Optional[str] = None
    PlantName: Optional[str] = None
    ListType: Optional[str] = None

class NotificationUpdate(NotificationBase):
    UserID: uuid.UUID

class NotificationResponse(NotificationBase):
    UserID: uuid.UUID
    CreatedDate: datetime
    ModifiedDate: datetime

    class Config:
        orm_mode = True

from sqlalchemy.orm import Session
from app.models.user_notification import UserNotification
from app.schemas.notification_schema import NotificationUpdate
from datetime import datetime

class NotificationService:

    @staticmethod
    def get_by_user_id(db: Session, user_id: str):
        return db.query(UserNotification).filter(UserNotification.UserID == user_id).all()

    @staticmethod
    def insert_or_update(db: Session, data: NotificationUpdate):
        existing = db.query(UserNotification).filter(
            UserNotification.UserID == data.UserID
        ).first()

        if existing:
            # Update allowed fields only
            existing.NotificationType = data.NotificationType
            existing.BusinessGroupName = data.BusinessGroupName
            existing.BusinessUnitName = data.BusinessUnitName
            existing.CountryName = data.CountryName
            existing.PlantName = data.PlantName
            existing.ListType = data.ListType
            existing.ModifiedDate = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            return existing

        # Insert new
        new_record = UserNotification(
            UserID=data.UserID,
            User=data.User,
            NotificationType=data.NotificationType,
            BusinessGroupName=data.BusinessGroupName,
            BusinessUnitName=data.BusinessUnitName,
            CountryName=data.CountryName,
            PlantName=data.PlantName,
            ListType=data.ListType,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationUpdate, NotificationResponse
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET Notification API
@router.get("/get/{user_id}", response_model=List[NotificationResponse])
def get_notification(user_id: str, db: Session = Depends(get_db)):
    return NotificationService.get_by_user_id(db, user_id)


# INSERT OR UPDATE Notification API
@router.post("/update", response_model=NotificationResponse)
def update_notification(data: NotificationUpdate, db: Session = Depends(get_db)):
    return NotificationService.insert_or_update(db, data)



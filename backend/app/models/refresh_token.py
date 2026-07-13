from datetime import datetime
from sqlalchemy import Boolean, TIMESTAMP, ForeignKey, text, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from typing import TYPE_CHECKING

# Para que Pylance no muestre error "User is not defined"
if TYPE_CHECKING:
    from app.models.user import User

class RefreshToken(Base):
    __tablename__ = "refresh_tokens" # Tiene que coincidir exacto con la tabla real en la BD

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    replaced_by_token_id: Mapped[int | None] = mapped_column(
        ForeignKey("refresh_tokens.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=text("now()"), nullable=False)

    # Permite obtener el usuario dueño de un token sin escribir una consulta SQL manual para cada caso
    user: Mapped["User"] = relationship(back_populates="refresh_tokens")
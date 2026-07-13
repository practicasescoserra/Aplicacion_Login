"""crear tablas iniciales

Revision ID: 964533ae9aa6
Revises: 
Create Date: 2026-07-12 20:50:13.094859

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '964533ae9aa6'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Migración baseline: las tablas users y refresh_tokens ya existen,
    # creadas manualmente y validadas antes de introducir Alembic.
    # Esta migración solo marca el punto de partida del historial.
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

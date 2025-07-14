"""add created_at to recipes

Revision ID: 03c967d58c50
Revises: 10e2a3aa83cb
Create Date: 2025-07-14 15:38:16.441868

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '03c967d58c50'
down_revision: Union[str, None] = '10e2a3aa83cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Добавляем колонку created_at с nullable=True сначала
    op.add_column('recipes', sa.Column('created_at', sa.DateTime(timezone=True), nullable=True))
    
    # Заполняем существующие записи текущим временем
    # Это безопасно, так как мы используем текущее время для всех старых записей
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE recipes SET created_at = NOW() WHERE created_at IS NULL")
    )
    
    # Теперь делаем колонку NOT NULL и добавляем server_default
    op.alter_column('recipes', 'created_at', 
                   nullable=False, 
                   server_default=sa.text('NOW()'))


def downgrade() -> None:
    """Downgrade schema."""
    # Удаляем колонку created_at
    op.drop_column('recipes', 'created_at')

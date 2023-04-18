"""tables

Revision ID: 043cb3b153f2
Revises: 4c5aa76afe5d
Create Date: 2023-04-18 00:58:02.380152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '043cb3b153f2'
down_revision = '4c5aa76afe5d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.alter_column('isGameOver',
               existing_type=sa.VARCHAR(),
               type_=sa.Boolean(),
               existing_nullable=True)
        batch_op.alter_column('betAmount',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
        batch_op.alter_column('setFunds',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.alter_column('setFunds',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
        batch_op.alter_column('betAmount',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
        batch_op.alter_column('isGameOver',
               existing_type=sa.Boolean(),
               type_=sa.VARCHAR(),
               existing_nullable=True)

    # ### end Alembic commands ###
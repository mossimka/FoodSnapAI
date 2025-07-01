import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

from src.database import Base
from src.auth.models import Users
from src.recipes.models import Recipe, IngredientCalories

# Загружаем переменные окружения
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Получаем конфигурацию Alembic
config = context.config

# Заменяем sqlalchemy.url из .env
db_url = os.getenv("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)
else:
    raise RuntimeError("DATABASE_URL not found in environment")

# Настройка логгирования
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Метаинформация моделей
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

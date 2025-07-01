#!/usr/bin/env python3
"""
Simple script to create an admin user
Usage: python create_admin_simple.py username email password
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.auth.models import Users
from src.auth.security import bcrypt_context


def create_admin(username: str, email: str, password: str):
    """Create admin user"""
    db: Session = SessionLocal()
    try:
        # Check if user exists
        existing = db.query(Users).filter(
            (Users.username == username) | (Users.email == email)
        ).first()
        
        if existing:
            if existing.is_admin:
                print(f"✅ User '{username}' is already an admin")
                return
            else:
                # Make existing user admin
                existing.is_admin = True
                db.commit()
                print(f"✅ Made existing user '{username}' an admin")
                return
        
        # Create new admin user
        admin = Users(
            username=username,
            email=email,
            hashed_password=bcrypt_context.hash(password),
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        print(f"✅ Created admin user '{username}' successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python create_admin_simple.py <username> <email> <password>")
        print("Example: python create_admin_simple.py admin admin@example.com mypassword123")
        sys.exit(1)
    
    username, email, password = sys.argv[1:4]
    create_admin(username, email, password) 
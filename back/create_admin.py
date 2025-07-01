#!/usr/bin/env python3
"""
CLI script to create admin users for FoodSnap AI
Usage: python create_admin.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.auth.models import Users
from src.auth.security import bcrypt_context


def create_admin_user(username: str, email: str, password: str) -> bool:
    """Create an admin user"""
    db: Session = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(Users).filter(
            (Users.username == username) | (Users.email == email)
        ).first()
        
        if existing_user:
            print(f"❌ User with username '{username}' or email '{email}' already exists")
            return False
        
        # Create admin user
        admin_user = Users(
            username=username,
            email=email,
            hashed_password=bcrypt_context.hash(password),
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Admin user '{username}' created successfully!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {e}")
        return False
    finally:
        db.close()


def make_user_admin(username: str) -> bool:
    """Make existing user an admin"""
    db: Session = SessionLocal()
    try:
        user = db.query(Users).filter(Users.username == username).first()
        
        if not user:
            print(f"❌ User '{username}' not found")
            return False
        
        if user.is_admin:
            print(f"ℹ️  User '{username}' is already an admin")
            return True
        
        user.is_admin = True
        db.commit()
        db.refresh(user)
        
        print(f"✅ User '{username}' is now an admin!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error making user admin: {e}")
        return False
    finally:
        db.close()


def list_admins():
    """List all admin users"""
    db: Session = SessionLocal()
    try:
        admins = db.query(Users).filter(Users.is_admin == True).all()
        
        if not admins:
            print("❌ No admin users found")
            return
        
        print("👑 Admin users:")
        for admin in admins:
            print(f"  - {admin.username} ({admin.email})")
            
    except Exception as e:
        print(f"❌ Error listing admins: {e}")
    finally:
        db.close()


def main():
    print("🔧 FoodSnap AI Admin Management Tool")
    print("=" * 40)
    
    while True:
        print("\nChoose an option:")
        print("1. Create new admin user")
        print("2. Make existing user admin")
        print("3. List all admins")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            print("\n📝 Create new admin user:")
            username = input("Username: ").strip()
            email = input("Email: ").strip()
            password = input("Password: ").strip()
            
            if not username or not email or not password:
                print("❌ All fields are required")
                continue
            
            create_admin_user(username, email, password)
            
        elif choice == "2":
            print("\n👑 Make existing user admin:")
            username = input("Username: ").strip()
            
            if not username:
                print("❌ Username is required")
                continue
            
            make_user_admin(username)
            
        elif choice == "3":
            print("\n📋 Admin users:")
            list_admins()
            
        elif choice == "4":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1-4.")


if __name__ == "__main__":
    main() 
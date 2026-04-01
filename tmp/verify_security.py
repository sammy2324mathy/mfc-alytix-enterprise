import os
import sys
from cryptography.fernet import Fernet

# Add shared to path
sys.path.insert(0, r"C:\Users\mabir\OneDrive\Desktop\mfc-alytix-enterprise\backend\shared")

from security import EncryptionService
from utils.logger import audit_logger

def test_encryption():
    print("Testing EncryptionService...")
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    service = EncryptionService()
    
    original_text = "Highly sensitive financial data"
    encrypted = service.encrypt(original_text)
    print(f"Original: {original_text}")
    print(f"Encrypted: {encrypted}")
    
    decrypted = service.decrypt(encrypted)
    print(f"Decrypted: {decrypted}")
    
    assert original_text == decrypted, "Encryption/Decryption failed!"
    print("Encryption test passed!")

def test_audit_logging():
    print("\nTesting AuditLogger...")
    audit_logger.log_event(
        event_type="security_test",
        user_id="user_123",
        action="verify_implementation",
        resource="verification_script",
        status="success",
        details={"test_key": "test_value"}
    )
    print("Audit log event sent (check console output).")

if __name__ == "__main__":
    try:
        test_encryption()
        test_audit_logging()
        print("\nVerification successful!")
    except Exception as e:
        print(f"\nVerification FAILED: {e}")
        sys.exit(1)

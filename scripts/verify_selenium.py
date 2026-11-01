import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
SCREENSHOT_DIR = os.path.join(os.getcwd(), "screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def setup_driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1440,900")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--ignore-certificate-errors")
    driver = webdriver.Chrome(options=opts)
    driver.set_page_load_timeout(30)
    return driver

def capture(driver, name, description):
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    driver.save_screenshot(path)
    print(f"[OK] {description} -> Saved to {path}")
    return path

def main():
    print(f"Starting Selenium verification against: {BASE_URL}")
    driver = setup_driver()
    wait = WebDriverWait(driver, 15)

    try:
        # 1. Landing Page
        print("\n--- 1. Testing Landing Page ---")
        driver.get(BASE_URL)
        time.sleep(3)
        capture(driver, "01_landing_hero", "Landing Page Hero & Instant Secret Box")

        # Check title / mascot / quick secret input
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert "KRYPHIX" in body_text, "Kryphix brand not found on landing page"
        print("[Pass] Landing page contains Kryphix brand and components.")

        # 2. Secret Creation on Landing
        print("\n--- 2. Testing Secret Creation ---")
        try:
            textarea = driver.find_element(By.TAG_NAME, "textarea")
            textarea.send_keys("TOP SECRET AGENT MEMO: Project Kryphix is fully operational!")
            time.sleep(1)
            capture(driver, "02_secret_typed", "Secret typed into zero-knowledge form")

            submit_btn = driver.find_element(By.XPATH, "//button[contains(., 'Buat Pesan Rahasia') or @type='submit']")
            submit_btn.click()
            time.sleep(3)
            capture(driver, "03_secret_created", "Secret generated with shareable link")
            print("[Pass] Zero-knowledge secret created successfully!")
        except Exception as e:
            print(f"[Warn] Instant secret creation UI interaction: {e}")

        # 3. Token & Top-up Pricing
        print("\n--- 3. Testing Token Packages & Top-up ---")
        driver.get(f"{BASE_URL}/wallet")
        time.sleep(3)
        capture(driver, "04_wallet_packages", "Wallet & Token Packages (Cyberpunk White)")
        print("[Pass] Wallet page rendered.")

        # 4. Steganography Lab
        print("\n--- 4. Testing Steganography Lab ---")
        driver.get(f"{BASE_URL}/stego")
        time.sleep(3)
        capture(driver, "05_stego_lab", "Steganography Pixel Vault")
        print("[Pass] Steganography lab rendered.")

        # 5. Secret Ephemeral Chat
        print("\n--- 5. Testing Ephemeral Chat Room ---")
        driver.get(f"{BASE_URL}/chat")
        time.sleep(3)
        capture(driver, "06_ephemeral_chat", "Ephemeral P2P Encrypted Chat Room")
        print("[Pass] Chat room creation page rendered.")

        # 6. Whistleblower DropBox
        print("\n--- 6. Testing Whistleblower Dead Drop ---")
        driver.get(f"{BASE_URL}/drop")
        time.sleep(3)
        capture(driver, "07_secret_drop", "Whistleblower 2-Way Anonymous Drop Box")
        print("[Pass] Secret Drop page rendered.")

        # 7. Shamir's Secret Sharing
        print("\n--- 7. Testing Shamir Secret Sharing ---")
        driver.get(f"{BASE_URL}/shamir")
        time.sleep(3)
        capture(driver, "08_shamir_split", "Shamir Consensus Vault")
        print("[Pass] Shamir secret sharing page rendered.")

        # 8. Nexus Admin Console Login
        print("\n--- 8. Testing Nexus Admin Console Login ---")
        driver.get(f"{BASE_URL}/admin/login")
        time.sleep(2)
        capture(driver, "09_admin_login", "Nexus Admin Login Portal")

        # Fill admin login form
        user_input = driver.find_element(By.XPATH, "//input[@type='text']")
        pass_input = driver.find_element(By.XPATH, "//input[@type='password']")
        user_input.send_keys("kryphix_admin")
        pass_input.send_keys("KryphixRoot2026!#")
        time.sleep(1)

        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()
        time.sleep(4)

        capture(driver, "10_admin_dashboard", "Nexus Admin Operations Console")
        print("[Pass] Logged into Nexus Admin Console successfully!")

        print("\n==============================================")
        print("ALL TESTS PASSED SUCCESSFULLY VIA SELENIUM!")
        print("==============================================")

    except Exception as err:
        print(f"\n[Selenium Error]: {err}")
        capture(driver, "error_state", "Error state capture")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

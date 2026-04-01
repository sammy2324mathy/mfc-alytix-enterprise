import os
from flask_appbuilder.security.manager import AUTH_DB

# =================================================================
# MFC-ALytix: Apache Airflow Webserver Configuration
# =================================================================
# This file configures the security and RBAC settings for the 
# Airflow UI to align with your enterprise security requirements.

# Enable Flask-WTF flag for CSRF to prevent cross-site request forgery
WTF_CSRF_ENABLED = True
WTF_CSRF_TIME_LIMIT = None

# ----------------------------------------------------
# AUTHENTICATION CONFIG
# ----------------------------------------------------
# By default we use the Database backend. If you integrate with your 
# new auth-service via OAuth or OpenID, you would change this to AUTH_OAUTH.
AUTH_TYPE = AUTH_DB

# Disable self-registration so external users can't just sign up for Airflow
AUTH_USER_REGISTRATION = False

# Give new users only Public access if registration is ever enabled
AUTH_USER_REGISTRATION_ROLE = "Public"

# ----------------------------------------------------
# UI / THEME CONFIG
# ----------------------------------------------------
# Choose a dark/professional theme for the Data Team
APP_THEME = "superhero.css"

# Ensure Airflow's native Role-Based Access Control (RBAC) is strictly enabled
RBAC_UI = True

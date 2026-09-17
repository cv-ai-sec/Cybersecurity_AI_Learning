import datetime

def block_ip_address(ip_address: str, reason: str) -> str:
    """Simulates adding an IP block rule to a network firewall."""
    # Critical System Protection: Prevent locking out localhost or core gateways
    PROTECTED_IPS = ["127.0.0.1", "192.168.1.1", "10.0.0.1"]
    
    if ip_address in PROTECTED_IPS:
        timestamp = datetime.datetime.now().isoformat()
        log_msg = f"[{timestamp}] [CRITICAL ALERT] FIREWALL REJECTED: Attempted to block protected IP {ip_address}!"
        print(f"\n{log_msg}")
        return log_msg

    timestamp = datetime.datetime.now().isoformat()
    success_msg = f"[{timestamp}] [FIREWALL SUCCESS] Rule Applied: IP {ip_address} BLOCKED. Reason: {reason}"
    print(f"\n{success_msg}")
    return success_msg
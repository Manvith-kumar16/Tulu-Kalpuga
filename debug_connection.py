import socket
import requests
import sys

def check_port(host, port, service_name):
    print(f"Checking {service_name} on {host}:{port}...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        if result == 0:
            print(f"✅ {service_name} is reachable on port {port}.")
            sock.close()
            return True
        else:
            print(f"❌ {service_name} is NOT reachable on port {port}.")
            sock.close()
            return False
    except Exception as e:
        print(f"❌ Error checking {service_name}: {e}")
        return False

def check_endpoint(url, service_name):
    print(f"Checking endpoint {url} for {service_name}...")
    try:
        response = requests.get(url, timeout=2)
        print(f"✅ {service_name} responded with status: {response.status_code}")
        print(f"   Response: {response.text[:100]}")
        return True
    except Exception as e:
        print(f"❌ Failed to reach {service_name} endpoint: {e}")
        return False

def main():
    print("--- Starting Connection Debug ---")
    
    # Check Python ML Server
    python_up = check_port("127.0.0.1", 5001, "Python ML Server")
    if python_up:
        check_endpoint("http://127.0.0.1:5001/", "Python ML Server")
    
    # Check Node Backend
    node_up = check_port("127.0.0.1", 5000, "Node Backend")
    if node_up:
        check_endpoint("http://127.0.0.1:5000/", "Node Backend")

    if not python_up:
        print("\n⚠️  ACTION REQUIRED: The Python ML server (port 5001) is not running.")
        print("   Please open a new terminal and run:")
        print("   cd \"D:\\Tulu Kalpuga\\ml\"")
        print("   python app.py")

    if not node_up:
        print("\n⚠️  ACTION REQUIRED: The Node backend (port 5000) is not running.")
        print("   Please open a new terminal and run:")
        print("   cd \"D:\\Tulu Kalpuga\\server\"")
        print("   npm start") # or node index.js

    if python_up and node_up:
        print("\n✅ Both servers appear to be running. If issues persist, check console logs for specific errors.")

if __name__ == "__main__":
    main()

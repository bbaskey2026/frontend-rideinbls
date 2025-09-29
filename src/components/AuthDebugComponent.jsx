import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const AuthDebugComponent = () => {
  const { 
    user, 
    token, 
    loading, 
    setUserAndToken, 
    logout, 
    register, 
    verifyRegistrationOtp,
    login,
    verifyLoginOtp,
    getAuthHeaders 
  } = useContext(AuthContext);

  const [debugInfo, setDebugInfo] = useState({
    testEmail: 'test@example.com',
    testPassword: 'password123',
    testName: 'Test User',
    testOtp: '123456'
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setDebugInfo(prev => ({ ...prev, [field]: value }));
  };

  const testRegister = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const result = await register(debugInfo.testName, debugInfo.testEmail, debugInfo.testPassword);
      setApiResponse({ type: 'register', result });
    } catch (error) {
      setApiResponse({ type: 'register', error: error.message });
    }
    setIsLoading(false);
  };

  const testVerifyRegistrationOtp = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const result = await verifyRegistrationOtp(debugInfo.testEmail, debugInfo.testOtp);
      setApiResponse({ type: 'verifyRegister', result });
    } catch (error) {
      setApiResponse({ type: 'verifyRegister', error: error.message });
    }
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const result = await login(debugInfo.testEmail, debugInfo.testPassword);
      setApiResponse({ type: 'login', result });
    } catch (error) {
      setApiResponse({ type: 'login', error: error.message });
    }
    setIsLoading(false);
  };

  const testVerifyLoginOtp = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const result = await verifyLoginOtp(debugInfo.testEmail, debugInfo.testOtp);
      setApiResponse({ type: 'verifyLogin', result });
    } catch (error) {
      setApiResponse({ type: 'verifyLogin', error: error.message });
    }
    setIsLoading(false);
  };

  const testManualAuth = () => {
    const mockUser = {
      id: 1,
      name: 'Debug User',
      email: 'debug@test.com'
    };
    const mockToken = 'mock-jwt-token-for-testing';
    setUserAndToken(mockUser, mockToken);
  };

  const testLogout = () => {
    logout();
    setApiResponse(null);
  };

  const testAuthHeaders = () => {
    const headers = getAuthHeaders();
    setApiResponse({ type: 'headers', result: headers });
  };

  const checkLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    setApiResponse({
      type: 'localStorage',
      result: {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken
      }
    });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setApiResponse({ type: 'localStorage', result: 'Cleared localStorage' });
  };

  const debugStyle = {
    fontFamily: 'monospace',
    padding: '20px',
    border: '2px solid #333',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    margin: '20px',
    maxWidth: '800px'
  };

  const sectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: 'white'
  };

  const buttonStyle = {
    margin: '5px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const inputStyle = {
    margin: '5px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '12px'
  };

  const responseStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '10px',
    marginTop: '10px',
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
    maxHeight: '200px'
  };

  return (
    <div style={debugStyle}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🐛 JWT Auth Debug Component</h2>
      
      {/* Current Auth State */}
      <div style={sectionStyle}>
        <h3>📊 Current Authentication State</h3>
        <p><strong>Loading:</strong> {loading ? '✅ True' : '❌ False'}</p>
        <p><strong>User Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Token Exists:</strong> {token ? '✅ Yes' : '❌ No'}</p>
        
        {user && (
          <div>
            <p><strong>User Data:</strong></p>
            <pre style={{ backgroundColor: '#e9ecef', padding: '10px', fontSize: '11px' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
        
        {token && (
          <div>
            <p><strong>Token (first 50 chars):</strong></p>
            <code style={{ backgroundColor: '#e9ecef', padding: '5px' }}>
              {token.substring(0, 50)}...
            </code>
          </div>
        )}
      </div>

      {/* Test Inputs */}
      <div style={sectionStyle}>
        <h3>⚙️ Test Configuration</h3>
        <div>
          <label>Name: </label>
          <input
            style={inputStyle}
            value={debugInfo.testName}
            onChange={(e) => handleInputChange('testName', e.target.value)}
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            style={inputStyle}
            value={debugInfo.testEmail}
            onChange={(e) => handleInputChange('testEmail', e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            style={inputStyle}
            type="password"
            value={debugInfo.testPassword}
            onChange={(e) => handleInputChange('testPassword', e.target.value)}
          />
        </div>
        <div>
          <label>OTP: </label>
          <input
            style={inputStyle}
            value={debugInfo.testOtp}
            onChange={(e) => handleInputChange('testOtp', e.target.value)}
          />
        </div>
      </div>

      {/* API Tests */}
      <div style={sectionStyle}>
        <h3>🧪 API Function Tests</h3>
        <div>
          <button style={buttonStyle} onClick={testRegister} disabled={isLoading}>
            Test Register
          </button>
          <button style={buttonStyle} onClick={testVerifyRegistrationOtp} disabled={isLoading}>
            Test Verify Registration OTP
          </button>
          <button style={buttonStyle} onClick={testLogin} disabled={isLoading}>
            Test Login
          </button>
          <button style={buttonStyle} onClick={testVerifyLoginOtp} disabled={isLoading}>
            Test Verify Login OTP
          </button>
        </div>
        {isLoading && <p style={{ color: '#007bff' }}>⏳ Making API call...</p>}
      </div>

      {/* Auth State Tests */}
      <div style={sectionStyle}>
        <h3>🔐 Authentication State Tests</h3>
        <button style={buttonStyle} onClick={testManualAuth}>
          Set Mock User & Token
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={testLogout}>
          Test Logout
        </button>
        <button style={buttonStyle} onClick={testAuthHeaders}>
          Check Auth Headers
        </button>
      </div>

      {/* localStorage Tests */}
      <div style={sectionStyle}>
        <h3>💾 localStorage Tests</h3>
        <button style={buttonStyle} onClick={checkLocalStorage}>
          Check localStorage
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={clearLocalStorage}>
          Clear localStorage
        </button>
      </div>

      {/* API Response Display */}
      {apiResponse && (
        <div style={sectionStyle}>
          <h3>📤 Last API Response</h3>
          <p><strong>Action:</strong> {apiResponse.type}</p>
          {apiResponse.error ? (
            <div>
              <p style={{ color: 'red' }}><strong>❌ Error:</strong></p>
              <div style={responseStyle}>
                {apiResponse.error}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'green' }}><strong>✅ Success:</strong></p>
              <div style={responseStyle}>
                {JSON.stringify(apiResponse.result, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Status */}
      <div style={sectionStyle}>
        <h3>🌐 Network Info</h3>
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Expected Endpoints:</strong></p>
        <ul style={{ fontSize: '12px' }}>
          <li>POST /api/auth/register</li>
          <li>POST /api/auth/register/verify</li>
          <li>POST /api/auth/login</li>
          <li>POST /api/auth/login/verify</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div style={sectionStyle}>
        <h3>📋 Usage Instructions</h3>
        <ol style={{ fontSize: '12px' }}>
          <li>Make sure your backend is running on http://localhost:5000</li>
          <li>Update test configuration if needed</li>
          <li>Test Register → should return OTP</li>
          <li>Test Verify Registration OTP → should set user & token</li>
          <li>Check if user appears in "Current Authentication State"</li>
          <li>Test logout and verify state clears</li>
          <li>Test login flow similarly</li>
          <li>Use "Set Mock User & Token" to test without backend</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
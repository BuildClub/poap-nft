import { useState, useCallback, useEffect } from 'react';

const storageName: string = 'userdata';

const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | boolean>(false);

  const login = useCallback((email: string, jwtToken: string, id: string, isAdmin: boolean) => {
    setToken(jwtToken);
    setUserId(id);
    setUserEmail(email);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userEmail: email,
        token: jwtToken,
        userId: id,
        isAdmin,
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(false);
    setUserEmail(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = localStorage.userdata ? JSON.parse(localStorage.userdata) : false;
    if (data && data.token) {
      login(data.userEmail, data.token, data.userId, data.isAdmin);
    }
  }, [login]);

  return { login, logout, token, userEmail, userId };
};

export default useAuth;

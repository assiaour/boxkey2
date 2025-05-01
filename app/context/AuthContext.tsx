import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for our context
type Password = {
  code: string;
  expiryDate: Date;
  isActive: boolean;
  clientId: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
};

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  clientId?: string; // Only for client users
};

type AuthContextType = {
  user: User | null;
  clients: Client[];
  passwords: Password[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addClient: (name: string, email: string) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  toggleClientStatus: (id: string) => void;
  generatePassword: (clientId: string, expiryHours: number) => string;
  getClientPasswords: (clientId: string) => Password[];
  getCurrentUserPassword: () => Password | null;
  requestNewPassword: (clientId: string) => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock data
const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'BOUDALI SidAhmed',
    email: 'sidou@example.com',
    status: 'active',
  },
  {
    id: '2',
    name: 'KOURTICHE Ali',
    email: 'ali@example.com',
    status: 'active',
  },
  {
    id: '3',
    name: 'LAREK Zineb',
    email: 'zineb@example.com',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'OURIEMCHI Assia',
    email: 'assia@example.com',
    status: 'active',
  },
  {
    id: '5',
    name: 'SOMEBODY Else',
    email: 'else@example.com',
    status: 'active',
  },
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [passwords, setPasswords] = useState<Password[]>([]);

  // Generate a random 6-digit PIN
  const generateRandomPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (email.includes('admin')) {
          setUser({
            id: 'admin-1',
            email,
            name: 'Admin User',
            role: 'admin',
          });
        } else {
          // Find matching client or create a new one for demo
          let clientId = '1'; // Default to first client
          const matchingClient = clients.find(
            (c) => c.email.toLowerCase() === email.toLowerCase()
          );

          if (matchingClient) {
            clientId = matchingClient.id;
          }

          setUser({
            id: `client-${clientId}`,
            email,
            name: matchingClient?.name || 'Client User',
            role: 'client',
            clientId,
          });
        }
        resolve();
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Client management functions
  const addClient = (name: string, email: string) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      email,
      status: 'active',
    };
    setClients([newClient, ...clients]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id));
    // Also delete associated passwords
    setPasswords(passwords.filter((password) => password.clientId !== id));
  };

  const toggleClientStatus = (id: string) => {
    setClients(
      clients.map((client) =>
        client.id === id
          ? {
              ...client,
              status: client.status === 'active' ? 'inactive' : 'active',
            }
          : client
      )
    );
  };

  // Password management functions
  const generatePassword = (clientId: string, expiryHours: number) => {
    const newPin = generateRandomPin();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiryHours);

    const newPassword: Password = {
      code: newPin,
      expiryDate,
      isActive: true,
      clientId,
    };

    setPasswords([newPassword, ...passwords]);
    return newPin;
  };

  const getClientPasswords = (clientId: string) => {
    return passwords.filter((password) => password.clientId === clientId);
  };

  const getCurrentUserPassword = () => {
    if (!user || user.role !== 'client' || !user.clientId) return null;

    // Get the most recent password for this client
    const clientPasswords = getClientPasswords(user.clientId);
    if (clientPasswords.length === 0) {
      // Create a mock password for demo purposes if none exists
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      const mockPassword: Password = {
        code: generateRandomPin(),
        expiryDate,
        isActive: true,
        clientId: user.clientId,
      };

      setPasswords([mockPassword, ...passwords]);
      return mockPassword;
    }

    // Sort by expiry date (newest first)
    return clientPasswords.sort(
      (a, b) => b.expiryDate.getTime() - a.expiryDate.getTime()
    )[0];
  };

  const requestNewPassword = (clientId: string) => {
    // In a real app, this would send a notification to the admin
    console.log(`New password requested for client ${clientId}`);
  };

  const value = {
    user,
    clients,
    passwords,
    login,
    logout,
    addClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    generatePassword,
    getClientPasswords,
    getCurrentUserPassword,
    requestNewPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

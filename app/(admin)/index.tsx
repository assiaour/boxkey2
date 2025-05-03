import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { KeyRound, Clock, Mail, Copy, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://boxkey.onrender.com';

export default function PasswordGeneratorScreen() {
  const { clients, generatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedPasswords, setGeneratedPasswords] = useState<Array<{
    id: string;
    password: string;
    expiryDate: Date;
    clientName: string;
    clientEmail: string;
    isActive: boolean;
  }>>([]);

  const handleGeneratePassword = async () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Please select a client');
      return;
    }

    setIsGenerating(true);
    
    try {
      const newPin = generatePassword(selectedClient, parseInt(expiryHours));
      
      // Store password in backend
      const response = await fetch(`${API_URL}/api/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPin,
          clientId: selectedClient,
          expiryHours: parseInt(expiryHours)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store password');
      }

      setPassword(newPin);
      
      // Add to generated passwords list
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + parseInt(expiryHours));
        
        setGeneratedPasswords([
          {
            id: Date.now().toString(),
            password: newPin,
            expiryDate,
            clientName: client.name,
            clientEmail: client.email,
            isActive: true,
          },
          ...generatedPasswords
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to generate and store password');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendPassword = () => {
    if (!password || !selectedClient) {
      Alert.alert('Error', 'Please generate a password first');
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      Alert.alert('Success', 'Password sent to client successfully');
    }, 1500);
  };

  const handleCopyPassword = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(password);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatExpiryDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (date: Date) => {
    return new Date() > date;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Generate Access Password</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Client</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientsContainer}>
            {clients.map(client => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientButton,
                  selectedClient === client.id && styles.clientButtonSelected
                ]}
                onPress={() => setSelectedClient(client.id)}
              >
                <Text style={[
                  styles.clientButtonText,
                  selectedClient === client.id && styles.clientButtonTextSelected
                ]}>
                  {client.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expiry Time (hours)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={expiryHours}
            onChangeText={setExpiryHours}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.buttonDisabled]}
          onPress={handleGeneratePassword}
          disabled={isGenerating || !selectedClient}
        >
          <KeyRound size={20} color="#ffffff" />
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating...' : 'Generate Password'}
          </Text>
        </TouchableOpacity>
        
        {password ? (
          <View style={styles.passwordContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabel}>Generated Password</Text>
              <TouchableOpacity onPress={handleCopyPassword} style={styles.copyButton}>
                {isCopied ? (
                  <Check size={18} color="#4c669f" />
                ) : (
                  <Copy size={18} color="#4c669f" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordValue}>{password}</Text>
            
            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.buttonDisabled]}
              onPress={handleSendPassword}
              disabled={isSending}
            >
              <Mail size={20} color="#ffffff" />
              <Text style={styles.sendButtonText}>
                {isSending ? 'Sending...' : 'Send to Client'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      
      {generatedPasswords.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Password History</Text>
          
          {generatedPasswords.map(item => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyItemHeader}>
                <Text style={styles.historyItemClient}>{item.clientName}</Text>
                <View style={[
                  styles.statusBadge,
                  isExpired(item.expiryDate) ? styles.statusExpired : styles.statusActive
                ]}>
                  <Text style={styles.statusText}>
                    {isExpired(item.expiryDate) ? 'Expired' : 'Active'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.historyItemPassword}>{item.password}</Text>
              
              <View style={styles.historyItemFooter}>
                <View style={styles.expiryContainer}>
                  <Clock size={14} color="#666" />
                  <Text style={styles.expiryText}>
                    Expires: {formatExpiryDate(item.expiryDate)}
                  </Text>
                </View>
                <Text style={styles.emailText}>{item.clientEmail}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clientsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  clientButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  clientButtonSelected: {
    backgroundColor: '#4c669f',
  },
  clientButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  clientButtonTextSelected: {
    color: '#ffffff',
  },
  generateButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  passwordContainer: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  copyButton: {
    padding: 4,
  },
  passwordValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#333',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemClient: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#e6f7ee',
  },
  statusExpired: {
    backgroundColor: '#ffe5e5',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333',
  },
  historyItemPassword: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
    marginBottom: 8,
  },
  historyItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
});
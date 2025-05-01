import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Copy, Check, Clock, RefreshCw } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function ClientAccessScreen() {
  const { user, getCurrentUserPassword, requestNewPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<{
    code: string;
    expiryDate: Date;
    isActive: boolean;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Load the current password when the component mounts
  useEffect(() => {
    const password = getCurrentUserPassword();
    if (password) {
      setCurrentPassword({
        code: password.code,
        expiryDate: password.expiryDate,
        isActive: password.isActive,
      });
    }
  }, [getCurrentUserPassword]);

  const handleCopyPassword = () => {
    if (!currentPassword) return;
    
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(currentPassword.code);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRequestNewPassword = () => {
    if (!user?.clientId) return;
    
    setIsRequesting(true);
    
    // Call the request function
    requestNewPassword(user.clientId);
    
    // Simulate API call
    setTimeout(() => {
      setIsRequesting(false);
      Alert.alert(
        'Request Sent',
        'Your request for a new access code has been sent to the property owner. You will be notified when a new code is generated.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const formatExpiryDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTimeRemaining = (expiryDate: Date) => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const isExpired = (date: Date) => {
    return new Date() > date;
  };

  if (!currentPassword) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Access Code</Text>
          <Text style={styles.noPasswordText}>No access code available. Please request a new code.</Text>
          <TouchableOpacity
            style={[styles.requestButton, isRequesting && styles.buttonDisabled]}
            onPress={handleRequestNewPassword}
            disabled={isRequesting}
          >
            <RefreshCw size={20} color="#ffffff" />
            <Text style={styles.requestButtonText}>
              {isRequesting ? 'Requesting...' : 'Request New Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Access Code</Text>
        
        <View style={styles.passwordContainer}>
          <View style={styles.passwordHeader}>
            <View style={[
              styles.statusBadge,
              isExpired(currentPassword.expiryDate) ? styles.statusExpired : styles.statusActive
            ]}>
              <Text style={styles.statusText}>
                {isExpired(currentPassword.expiryDate) ? 'Expired' : 'Active'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCopyPassword} style={styles.copyButton}>
              {isCopied ? (
                <Check size={18} color="#4c669f" />
              ) : (
                <Copy size={18} color="#4c669f" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.passwordValue}>{currentPassword.code}</Text>
          
          <View style={styles.expiryContainer}>
            <Clock size={16} color="#666" />
            <Text style={styles.expiryText}>
              {isExpired(currentPassword.expiryDate) 
                ? 'Expired on ' + formatExpiryDate(currentPassword.expiryDate)
                : calculateTimeRemaining(currentPassword.expiryDate)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.requestButton, isRequesting && styles.buttonDisabled]}
          onPress={handleRequestNewPassword}
          disabled={isRequesting}
        >
          <RefreshCw size={20} color="#ffffff" />
          <Text style={styles.requestButtonText}>
            {isRequesting ? 'Requesting...' : 'Request New Code'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.instructionsCard}>
        <Text style={styles.cardTitle}>How to Use Your Code</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Locate the KeyBox</Text>
            <Text style={styles.stepDescription}>
              Find the KeyBox located next to the main entrance of the property.
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Enter Your Code</Text>
            <Text style={styles.stepDescription}>
              Enter the 6-digit code shown above on the KeyBox keypad. Press # after entering the code.
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Open the Box</Text>
            <Text style={styles.stepDescription}>
              After entering the correct code, the KeyBox will unlock. Pull the door open to access the keys.
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Close the Box</Text>
            <Text style={styles.stepDescription}>
              After retrieving the keys, close the KeyBox door securely. It will automatically lock.
            </Text>
          </View>
        </View>
      </View>
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
  noPasswordText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  passwordContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#e6f7ee',
  },
  statusExpired: {
    backgroundColor: '#ffe5e5',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
  copyButton: {
    padding: 8,
  },
  passwordValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#333',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: '#4c669f',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  requestButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  instructionsCard: {
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
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4c669f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
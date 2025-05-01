import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Mail, Phone, MessageCircle } from 'lucide-react-native';

export default function HelpScreen() {
  const handleContactEmail = () => {
    Linking.openURL('mailto:support@keyboxmanager.com');
  };

  const handleContactPhone = () => {
    Linking.openURL('tel:+213656855101');
  };

  const handleContactChat = () => {
    // In a real app, this would open a chat interface
    alert('Chat support would open here');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How KeyBox Works</Text>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1737442886747-9fb768b96ed2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.sectionTitle}>
          The Smart Way to Access Rental Properties
        </Text>
        <Text style={styles.paragraph}>
          KeyBox Manager provides a secure and convenient way for property
          owners to grant access to their rental properties without physically
          exchanging keys.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>For Guests</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureNumber}>1</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Receive Your Access Code</Text>
            <Text style={styles.featureDescription}>
              The property owner will generate a unique 6-digit access code for
              you and set an expiry time. You'll receive this code through the
              app.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureNumber}>2</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Enter Code at the Property</Text>
            <Text style={styles.featureDescription}>
              When you arrive at the property, locate the KeyBox next to the
              entrance. Enter your 6-digit code on the keypad followed by the #
              key.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureNumber}>3</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Access the Keys</Text>
            <Text style={styles.featureDescription}>
              The KeyBox will unlock, allowing you to retrieve the property keys
              from inside. Close the box when done, and it will automatically
              lock.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureNumber}>4</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Request New Codes if Needed</Text>
            <Text style={styles.featureDescription}>
              If your code expires or you need a new one, you can request it
              directly through the app. The property owner will be notified of
              your request.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            What if my access code doesn't work?
          </Text>
          <Text style={styles.faqAnswer}>
            First, check if the code has expired. If it's still valid, make sure
            you're entering it correctly followed by the # key. If issues
            persist, request a new code or contact the property owner.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            Can I share my access code with others?
          </Text>
          <Text style={styles.faqAnswer}>
            Access codes are meant for authorized guests only. Please don't
            share your code with others unless approved by the property owner.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            What if the KeyBox is damaged or not working?
          </Text>
          <Text style={styles.faqAnswer}>
            If you notice any issues with the KeyBox, please contact the
            property owner immediately. They can provide alternative access
            methods if needed.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            How long is my access code valid?
          </Text>
          <Text style={styles.faqAnswer}>
            Access codes have specific expiry times set by the property owner.
            You can see the remaining time on your access code screen.
            Typically, codes are valid for the duration of your stay.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Need Help?</Text>
        <Text style={styles.paragraph}>
          If you have any questions or need assistance, our support team is here
          to help.
        </Text>

        <View style={styles.contactOptions}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactEmail}
          >
            <Mail size={24} color="#4c669f" />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactPhone}
          >
            <Phone size={24} color="#4c669f" />
            <Text style={styles.contactButtonText}>Call Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactChat}
          >
            <MessageCircle size={24} color="#4c669f" />
            <Text style={styles.contactButtonText}>Live Chat</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#4c669f',
    width: 30,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  contactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactButton: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    marginBottom: 10,
  },
  contactButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4c669f',
    marginTop: 8,
    textAlign: 'center',
  },
});

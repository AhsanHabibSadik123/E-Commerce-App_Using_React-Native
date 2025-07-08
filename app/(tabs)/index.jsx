// This index.jsx file
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import Register from '../Component/Register';
import Home from '../Component/Home';
import Record from '../Component/Record';
import Cart from '../Component/Cart';
import Account from '../Component/Account';
import Login from '../Component/Login';
import ProductDetailsScreen from '../Component/ProductDetailsScreen';

const TABS = [
  { name: 'Home', component: Home },
  { name: 'Record', component: Record },
  { name: 'Cart', component: Cart },
  { name: 'Account', component: Account },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [lastViewedProduct, setLastViewedProduct] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);


  const activeTabInfo = TABS.find(tab => tab.name === activeTab);
  const ActiveComponent = activeTabInfo ? activeTabInfo.component : () => <Text>Invalid Tab</Text>;

if (!isLoggedIn && isRegistering) {
  return <Register onRegister={() => {
    setIsLoggedIn(true);
    setIsRegistering(false);
    setActiveTab('Home');
  }} onBackToLogin={() => setIsRegistering(false)} />;
}

if (!isLoggedIn) {
  return <Login onLogin={() => { setIsLoggedIn(true); setActiveTab('Home'); }} onRegisterPress={() => setIsRegistering(true)} />;
}

  if (selectedProduct) {
    return (
      <ProductDetailsScreen
        product={selectedProduct}
        onBack={() => {
          setSelectedProduct(null);
          setActiveTab('Home');
        }}
        onAddToCart={(product, selectedSize, selectedColor) => {
          setCart([
            ...cart,
            {
              ...product,
              selectedSize,
              selectedColor,
            },
          ]);
          setLastViewedProduct(product);
          setSelectedProduct(null);
          setActiveTab('Cart');
        }}
        onBuyNow={() => {
          setSelectedProduct(null);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffe4ec' }}>
      <View style={{ flex: 1, backgroundColor: '#ffe4ec' }}>
        {activeTab === 'Home' ? (
          <Home
            onBack={() => setIsLoggedIn(false)}
            onProductPress={product => {
              setSelectedProduct(product);
              setLastViewedProduct(product);
            }}
          />
        ) : activeTab === 'Account' ? (
          <Account onLogout={() => setIsLoggedIn(false)} />
        ) : activeTab === 'Cart' ? (
          <Cart
            onBack={() => {
              if (lastViewedProduct) {
                setSelectedProduct(lastViewedProduct);
              }
            }}
            cart={cart}
            onDeleteItem={idx => {
              setCart(cart.filter((_, i) => i !== idx));
            }}
          />
        ) : (
          <ActiveComponent />
        )}
      </View>

      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.name)}
          >
            {tab.name === 'Home' && (
              <Feather
                name="home"
                size={24}
                color={activeTab === 'Home' ? '#000' : '#888'}
                style={{ marginBottom: 2 }}
              />
            )}
            {tab.name === 'Record' && (
              <Octicons
                name="three-bars"
                size={24}
                color={activeTab === 'Record' ? '#000' : '#888'}
                style={{ marginBottom: 2 }}
              />
            )}
            {tab.name === 'Cart' && (
              <AntDesign
                name="shoppingcart"
                size={24}
                color={activeTab === 'Cart' ? '#000' : '#888'}
                style={{ marginBottom: 2 }}
              />
            )}
            {tab.name === 'Account' && (
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={activeTab === 'Account' ? '#000' : '#888'}
                style={{ marginBottom: 2 }}
              />
            )}
            <Text
              style={
                activeTab === tab.name ? styles.activeTabText : styles.tabText
              }
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    paddingBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import ProductCard from './ProductCard';
import data from '../data/Data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const categories = ['All', 'Trending Now', 'New', 'Fashion', 'Mens', 'Womens'];

const Home = ({ onProductPress }) => {
  const [activeCategory, setActiveCategory] = useState('Trending Now');
  const [userName, setUserName] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUserName(user.displayName);
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(favs =>
      favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    );
  };

  // Filter products based on search query and category
  const getFilteredProducts = () => {
    let filteredProducts = data.products;

    // Apply search filter first
    if (searchQuery.trim()) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // Apply category filter only when not searching
      if (activeCategory === 'New') {
        // Show latest products (assuming higher IDs are newer)
        filteredProducts = filteredProducts.slice(-6);
      } else if (activeCategory === 'Fashion') {
        // Filter fashion items (you can customize this based on your data)
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes('shirt') || 
          product.title.toLowerCase().includes('jacket') ||
          product.title.toLowerCase().includes('sweater')
        );
      } else if (activeCategory === 'Mens') {
        // Filter men's items
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes('jacket') ||
          product.title.toLowerCase().includes('coat') ||
          product.title.toLowerCase().includes('jeans')
        );
      } else if (activeCategory === 'Womens') {
        // Filter women's items
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes('sweater') ||
          product.title.toLowerCase().includes('shirt')
        );
      } else if (activeCategory === 'Sale') {
        // Show products under $50 as sale items
        filteredProducts = filteredProducts.filter(product => product.price < 50);
      } else if (activeCategory === 'Trending Now') {
        // Show most popular items (you can customize this logic)
        filteredProducts = filteredProducts.slice(0, 6);
      }
      // 'All' category shows all products (no additional filtering)
    }

    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Welcome{userName ? `, ${userName}` : ''}
        </Text>
        <Ionicons name="person-circle-outline" size={40} color="#222" />
      </View>

      <View style={styles.searchBarContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Feather name="x" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        bounces={true}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={120}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryItem, activeCategory === cat && styles.categoryItemActive]}
            onPress={() => {
              setActiveCategory(cat);
              // Clear search when selecting a category
              if (searchQuery.trim()) {
                setSearchQuery('');
              }
            }}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Show search results count if searching */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Text>
          {filteredProducts.length === 0 && (
            <Text style={styles.noResultsText}>
              Try adjusting your search terms
            </Text>
          )}
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => onProductPress(item)}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.productList,
          filteredProducts.length === 0 && styles.emptyProductList
        ]}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.productRow : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery.trim() ? (
            <View style={styles.emptySearchContainer}>
              <Feather name="search" size={48} color="#ccc" />
              <Text style={styles.emptySearchText}>No products found</Text>
              <Text style={styles.emptySearchSubtext}>
                Try searching for something else
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3f8',
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff0f6',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6e6',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#ffb6d5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#ffb6d5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchResultsText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 15,
    paddingTop: 5,
    height: 54,
    alignItems: 'center',
    paddingRight: 20,
  },
  categoryItem: {
    backgroundColor: '#f7e6f7',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ffb6d5',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItemActive: {
    backgroundColor: '#E96E6E',
    borderColor: '#E96E6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  emptyProductList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptySearchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptySearchText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySearchSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

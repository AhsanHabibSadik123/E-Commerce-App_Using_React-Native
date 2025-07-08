import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const Cart = ({ onBack, cart = [], onDeleteItem, onCheckout }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.itemDetail}>
          Size: <Text style={{ fontWeight: "bold" }}>{item.selectedSize || "-"}</Text>
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
          <Text style={styles.itemDetail}>Color: </Text>
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: item.selectedColor || "#eee" },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteItem(index)}
      >
        <AntDesign name="delete" size={22} color="#E96E6E" />
      </TouchableOpacity>
    </View>
  );

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>

      <View style={styles.cartItems}>
        {cart.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        ) : (
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>

      <View style={styles.cartSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <Text>{cart.length} item{cart.length !== 1 ? "s" : ""} in cart</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping:</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.grandTotalLabel}>Grand Total:</Text>
          <Text style={styles.grandTotalValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff3f8",
  },
  header: {
    width: "100%",
    paddingTop: 48,
    paddingBottom: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2c6d6",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#f2c6d6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 44,
    width: 44,
    height: 44,
    backgroundColor: "#E96E6E",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffb6d5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E96E6E",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#e0e0e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: "#f2f2f2",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: "#E96E6E",
    fontWeight: "600",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  colorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 18,
    marginTop: 40,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#fff0f3",
    alignItems: "center",
    justifyContent: "center",
  },
  cartSummary: {
    padding: 22,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderTopColor: "#f2c6d6",
    shadowColor: "#e0e0e0",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E96E6E",
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#444",
  },
  summaryValue: {
    fontSize: 16,
    color: "#444",
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  grandTotalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  checkoutButton: {
    backgroundColor: "#E96E6E",
    paddingVertical: 16,
    paddingHorizontal: 70,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#ffb6d5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
});

class MarketplaceService {
  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.recommendations = new Map();
    this.analytics = new Map();
    this.escrow = new EscrowService();
  }

  async listProduct(productData) {
    const productId = `prod-${Date.now()}`;
    const product = {
      id: productId,
      ...productData,
      status: 'active',
      createdAt: Date.now(),
      stats: {
        views: 0,
        sales: 0,
        rating: 0
      }
    };

    this.products.set(productId, product);
    await this.updateRecommendations(product.category);
    return productId;
  }

  async createOrder(orderData) {
    const orderId = `order-${Date.now()}`;
    const order = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: Date.now(),
      timeline: [{
        status: 'created',
        timestamp: Date.now()
      }]
    };

    await this.escrow.createEscrow(orderId, orderData.amount);
    this.orders.set(orderId, order);
    return orderId;
  }

  async processOrder(orderId) {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'processing';
    order.timeline.push({
      status: 'processing',
      timestamp: Date.now()
    });

    const product = this.products.get(order.productId);
    product.stats.sales++;

    await this.escrow.lockFunds(orderId);
    return order;
  }

  async completeOrder(orderId) {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'completed';
    order.timeline.push({
      status: 'completed',
      timestamp: Date.now()
    });

    await this.escrow.releaseFunds(orderId);
    await this.updateAnalytics(order.productId);
    return order;
  }

  async addReview(productId, reviewData) {
    const reviewId = `review-${Date.now()}`;
    const review = {
      id: reviewId,
      productId,
      ...reviewData,
      createdAt: Date.now()
    };

    this.reviews.set(reviewId, review);
    await this.updateProductRating(productId);
    return reviewId;
  }

  async updateProductRating(productId) {
    const reviews = Array.from(this.reviews.values())
      .filter(review => review.productId === productId);

    const product = this.products.get(productId);
    product.stats.rating = reviews.reduce((sum, review) => 
      sum + review.rating, 0) / reviews.length;
  }

  async getRecommendations(userId, category) {
    const userOrders = Array.from(this.orders.values())
      .filter(order => order.userId === userId);

    const recommendations = Array.from(this.products.values())
      .filter(product => 
        product.category === category &&
        !userOrders.some(order => order.productId === product.id)
      )
      .sort((a, b) => b.stats.rating - a.stats.rating)
      .slice(0, 10);

    this.recommendations.set(userId, {
      category,
      products: recommendations,
      generatedAt: Date.now()
    });

    return recommendations;
  }

  async updateRecommendations(category) {
    const users = new Set(
      Array.from(this.orders.values()).map(order => order.userId)
    );

    for (const userId of users) {
      await this.getRecommendations(userId, category);
    }
  }

  async updateAnalytics(productId) {
    const product = this.products.get(productId);
    const productOrders = Array.from(this.orders.values())
      .filter(order => order.productId === productId);

    const analytics = {
      totalSales: productOrders.length,
      revenue: productOrders.reduce((sum, order) => sum + order.amount, 0),
      averageRating: product.stats.rating,
      conversionRate: (productOrders.length / product.stats.views) * 100
    };

    this.analytics.set(productId, {
      ...analytics,
      updatedAt: Date.now()
    });

    return analytics;
  }

  async searchProducts(query) {
    return Array.from(this.products.values())
      .filter(product => 
        product.status === 'active' &&
        (product.name.toLowerCase().includes(query.toLowerCase()) ||
         product.description.toLowerCase().includes(query.toLowerCase()))
      );
  }

  async getProductAnalytics(productId) {
    const analytics = this.analytics.get(productId);
    const product = this.products.get(productId);

    return {
      ...analytics,
      currentStats: product.stats,
      category: product.category
    };
  }
}

class EscrowService {
  constructor() {
    this.escrows = new Map();
  }

  async createEscrow(orderId, amount) {
    this.escrows.set(orderId, {
      amount,
      status: 'created',
      createdAt: Date.now()
    });
  }

  async lockFunds(orderId) {
    const escrow = this.escrows.get(orderId);
    escrow.status = 'locked';
  }

  async releaseFunds(orderId) {
    const escrow = this.escrows.get(orderId);
    escrow.status = 'released';
  }
}

export default MarketplaceService;
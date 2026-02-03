// ProductCard Component Stub
// Commerce Bundle - Frontend Scaffold Agent

import React from 'react';
import { Product } from '../../types/api';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    product: Product;
    detailed?: boolean;
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    detailed = false,
    onAddToCart,
    onViewDetails,
}) => {
    return (
        <article className={`${styles.productCard} ${detailed ? styles.detailed : ''}`}>
            <div className={styles.imageWrapper}>
                <img
                    src={product.images[0] || '/placeholder-product.png'}
                    alt={product.name}
                    className={styles.image}
                />
                {product.featured && <span className={styles.badge}>Featured</span>}
            </div>

            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>

                {detailed && (
                    <p className={styles.description}>{product.description}</p>
                )}

                <div className={styles.priceRow}>
                    <span className={styles.price}>${product.basePrice.toFixed(2)}</span>
                    {!detailed && (
                        <span className={styles.fromLabel}>from</span>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                {detailed ? (
                    <button onClick={() => onAddToCart?.(product)} className={styles.addBtn}>
                        Add to Cart
                    </button>
                ) : (
                    <button onClick={() => onViewDetails?.(product)} className={styles.viewBtn}>
                        View Details
                    </button>
                )}
            </div>

            <div className={styles.pluginSlot} data-slot="product-plugin" />
        </article>
    );
};

export default ProductCard;

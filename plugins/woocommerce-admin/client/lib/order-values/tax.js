/**
 * External dependencies
 */
import { find, get } from 'lodash';

/**
 * Get the total tax for the discount value
 *
 * @param {Object} order An order as returned from API
 * @return {number} Tax amount as a decimal number
 */
export function getOrderDiscountTax( order ) {
	const coupons = get( order, 'coupon_lines', [] );
	const tax = coupons.reduce(
		( sum, value ) => sum + parseFloat( value.discount_tax ),
		0
	);
	return parseFloat( tax ) || 0;
}

/**
 * Get the total tax for a given line item's value
 *
 * @param {Object} order An order as returned from API
 * @param {number} id    The ID of the line_item
 * @return {number} Tax amount as a decimal number
 */
export function getOrderLineItemTax( order, id ) {
	const items = get( order, 'line_items', [] );
	const tax = get( find( items, { id } ), 'taxes[0].total', 0 );
	return parseFloat( tax ) || 0;
}

/**
 * Get the total tax for a given fee
 *
 * @param {Object} order An order as returned from API
 * @param {number} id    The ID of a fee line in this order
 * @return {number} Tax amount as a decimal number
 */
export function getOrderFeeTax( order, id ) {
	const items = get( order, 'fee_lines', [] );
	const tax = get( find( items, { id } ), 'taxes[0].total', 0 );
	return parseFloat( tax ) || 0;
}

/**
 * Get the total tax for all fees in an order (total of all fee lines)
 *
 * @param {Object} order An order as returned from API
 * @return {number} Tax amount as a decimal number
 */
export function getOrderFeeTotalTax( order ) {
	const lines = get( order, 'fee_lines', [] );
	return lines.reduce(
		( sum, value ) => sum + getOrderFeeTax( order, value.id ),
		0
	);
}

/**
 * Get the total tax for the shipping value
 *
 * @param {Object} order An order as returned from API
 * @return {number} Tax amount as a decimal number
 */
export function getOrderShippingTax( order ) {
	const tax = get( order, 'shipping_lines[0].taxes[0].total', 0 );
	return parseFloat( tax ) || 0;
}

/**
 * Get the total tax for the subtotal value (total of all line items)
 *
 * @param {Object} order An order as returned from API
 * @return {number} Tax amount as a decimal number
 */
export function getOrderSubtotalTax( order ) {
	const items = get( order, 'line_items', [] );
	return items.reduce(
		( sum, value ) => sum + getOrderLineItemTax( order, value.id ),
		0
	);
}

/**
 * Get the total tax for the total value
 *
 * @param {Object} order An order as returned from API
 * @return {number} Tax amount as a decimal number
 */
export function getOrderTotalTax( order ) {
	const subtotal = getOrderSubtotalTax( order );
	const shipping = getOrderShippingTax( order );
	const fees = getOrderFeeTotalTax( order );
	return subtotal + shipping + fees;
}

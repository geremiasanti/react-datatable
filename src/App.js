import { useState } from 'react'

function FilterableProductTable({products}) {
	const [filterText, setFilterText] = useState('');
	const [inStockOnly, setInStockOnly] = useState(false);

	return (
		<>
			<SearchBar 
				filterText={filterText}
				inStockOnly={inStockOnly}
				onFilterTextChange={setFilterText}
				onInStockOnlyChange={setInStockOnly}
			/>
			<ProductTable 
				filterText={filterText}
				inStockOnly={inStockOnly}
				products={products}
			/>
		</>
	);
}

function SearchBar({
	filterText,
	inStockOnly,
	onFilterTextChange,
	onInStockOnlyChange
}) {
	return (
		<form>
			<input 
				type="text" 
				placeholder="Search.." 
				value={filterText}
				onChange={(e) => onFilterTextChange(e.target.value)}
			/>
			<div>
				<label>
					<input 
						type="checkbox" 
						checked={inStockOnly}
						onChange={(e) => onInStockOnlyChange(e.target.checked)}
					/>
					Only show products in stock
				</label>
			</div>
		</form>
	);
}

function ProductTable({products, filterText, inStockOnly}) {
	const rows = [];
	let lastCategory = null;

	products.forEach((product) => {
		if( 
			product.name.toLowerCase().indexOf(
				filterText.toLowerCase()
			) === -1
		) {
			return;
		}

		if(inStockOnly && !product.stocked) {
			return;
		}

		if(product.category !== lastCategory) {
			rows.push(
				<ProductCategoryRow 
					category={product.category} 
					key={product.category}
				/>
			);
			lastCategory = product.category;
		}
		rows.push(
			<ProductRow 
				product={product}
				key={product.name}
			/>
		);
	})

	return (
		<table>
			<thead>
				<tr>
					<th>Product</th>
					<th >Price</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function ProductCategoryRow({category}) {
	return (
		<tr>
			<th colSpan="2">
				{category}
			</th>
		</tr>
	)
}

function ProductRow({product}) {
	const nameFormatted = product.stocked 
		? product.name
		: <span style={{ color: 'red' }}>{product.name}</span>

	return (
		<tr>
			<td>
				{nameFormatted}
			</td>
			<td style={{ textAlign: 'center' }}>
				{product.price}
			</td>
		</tr>
	)
}

const PRODUCTS = [
	{category: "Fruits", price: "$1", stocked: true, name: "Apple"},
	{category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
	{category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
	{category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
	{category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
	{category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
	return <FilterableProductTable products={PRODUCTS} />;
}

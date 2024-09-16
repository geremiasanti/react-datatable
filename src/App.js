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
	const showColumns = [
		{
			prop: 'category',
			display: 'Category'
		},
		{
			prop: 'name',
			display: 'Product'
		},
		{
			prop: 'price',
			display: 'Price'
		}
	]
	const [orderColumns, setOrderColumns] = useState([showColumns[0].prop]);

	const rows = products.filter((product) => {
		if(product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
			return false;
		}

		if(inStockOnly && !product.stocked) {
			return false;
		}

		return true;
	}).map((product) => {
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

		return (
			<ProductRow 
				showColumns={showColumns}
				product={product}
				key={product.name}
			/>
		);
	});


	return (
		<table>
			<thead>
				<ProductHeader showColumns={showColumns}/>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

function ProductHeader({showColumns}) {
	const columnHeaders = showColumns.map(
		(col) => <th key={col.prop}>{col.display}</th>
	);
	return (
		<tr>
			{columnHeaders}
		</tr>
	);
}

function ProductRow({product}) {
	const nameFormatted = product.stocked 
		? product.name
		: <span style={{ color: 'red' }}>{product.name}</span>

	return (
		<tr>
			<td>
				{product.category}
			</td>
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
	{category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
	{category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
	{category: "Vegetables", price: "$1", stocked: true, name: "Peas"},
	{category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"}
];

export default function App() {
	return <FilterableProductTable products={PRODUCTS} />;
}

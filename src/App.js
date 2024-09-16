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
	const [orderColumns, setOrderColumns] = useState([{
		prop: showColumns[0].prop,
		asc: true,
	}]);
	
	function handleOrdering(prop) {
		const nextOrderColumns = orderColumns.slice();

		const samePropValue = (ord) => ord.prop === prop;
		const existingOrderColumn= orderColumns.find(samePropValue)
		const orderColumnPriority = orderColumns.findIndex(samePropValue) 

		// if new to order cols, unshift it
		if(!existingOrderColumn) {
			nextOrderColumns.unshift({
				prop: prop,
				asc: true,
			})
			setOrderColumns(nextOrderColumns);	
			return;
		} 

		// if max priority, invert ordering
		if(orderColumnPriority === 0) {
			existingOrderColumn.asc = !existingOrderColumn.asc;	
			nextOrderColumns[0] = existingOrderColumn;
			setOrderColumns(nextOrderColumns);
			return;
		}

		// if not max priority, make it max priority
		nextOrderColumns.splice(orderColumnPriority, 1);
		nextOrderColumns.unshift(existingOrderColumn);
		setOrderColumns(nextOrderColumns);
	}

	const rows = products.filter((product) => {
		if(product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
			return false;
		}

		if(inStockOnly && !product.stocked) {
			return false;
		}

		return true;
	}).map((product) => {
		return (
			<ProductRow 
				key={product.name}
				showColumns={showColumns}
				product={product}
			/>
		);
	});


	return (
		<table>
			<thead>
				<ProductHeader 
					showColumns={showColumns}
					orderColumns={orderColumns}
					onColumnHeaderClick={handleOrdering}
				/>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

function ProductHeader({showColumns, orderColumns, onColumnHeaderClick}) {
	const columnHeaders = showColumns.map(
		(col) => {
			let displayOrder = "";	
			
			const samePropValue = (ord) => ord.prop === col.prop;
			const orderColumn = orderColumns.find(samePropValue)
			const orderColumnPriority = orderColumns.findIndex(samePropValue) 
			if(orderColumn)
				displayOrder = 
					`(${orderColumnPriority} ${orderColumn.asc ? 'asc' : 'desc'})`;

			return (
				<th 
					key={col.prop}
					onClick={() => onColumnHeaderClick(col.prop)}
				>
					{col.display}
					&nbsp;
					<span style={{ fontWeight: 'normal' }}>{displayOrder}</span>
				</th>
			)
		}
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
	{category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
	{category: "Vegetables", price: "$1", stocked: true, name: "Peas"},
];

export default function App() {
	return <FilterableProductTable products={PRODUCTS} />;
}

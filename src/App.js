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
	
	function handleOrdering(prop, remove = false) {
		const nextOrderColumns = orderColumns.slice();

		const samePropValue = (ord) => ord.prop === prop;
		const existingOrderColumn= orderColumns.find(samePropValue)
		const orderColumnPriority = orderColumns.findIndex(samePropValue) 

		if(remove) {
			nextOrderColumns.splice(orderColumnPriority, 1);
			setOrderColumns(nextOrderColumns);
			return;
		}

		if(!existingOrderColumn) {
			nextOrderColumns.push({
				prop: prop,
				asc: true,
			})
			setOrderColumns(nextOrderColumns);	
		} else {
			existingOrderColumn.asc = !existingOrderColumn.asc;	
			nextOrderColumns[orderColumnPriority] = existingOrderColumn;
			setOrderColumns(nextOrderColumns);
		}
	}

	const filteredOrderedProducts = products.filter((product) => {
		if(product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
			return false;
		}

		if(inStockOnly && !product.stocked) {
			return false;
		}

		return true;
	}).sort((p0, p1) => { 
		let acc = 0;
		orderColumns.forEach((ord) => {
			acc ||= ord.asc 
				? p0[ord.prop].localeCompare(p1[ord.prop])
				: p1[ord.prop].localeCompare(p0[ord.prop])
		})
		return acc
	});

	const rows = filteredOrderedProducts.map((product) => {
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
			let removeOrder = "";	
			
			const samePropValue = (ord) => ord.prop === col.prop;
			const orderColumn = orderColumns.find(samePropValue)
			const orderColumnPriority = orderColumns.findIndex(samePropValue) 
			if(orderColumn) {
				displayOrder = 
					`(${orderColumnPriority} ${orderColumn.asc ? 'asc' : 'desc'})`;
				removeOrder = 'X'
			}
				

			return (
				<th key={col.prop}>
					<span 
						style={{ cursor: 'pointer' }}
						onClick={() => onColumnHeaderClick(col.prop)}
					>
						{col.display}
					</span>
					&nbsp;
					<span 
						style={{ fontWeight: 'normal', cursor: 'pointer' }}
						onClick={() => onColumnHeaderClick(col.prop)}
					>
						{displayOrder}
					</span>
					&nbsp;
					<span 
						style={{ fontWeight: 'normal', cursor: 'pointer' }}
						onClick={() => onColumnHeaderClick(col.prop, true)}
					>
						{removeOrder}
					</span>
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

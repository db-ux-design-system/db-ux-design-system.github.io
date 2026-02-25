import {
	DBBadge,
	DBCheckbox,
	DBButton,
	DBSelect,
	DBInput,
	DBIcon,
	DBStack,
} from '@db-ux/react-core-components';
import { useState } from 'react';
import './SelectableTable.css';

export const SelectableTable = () => {
	const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
	const [statusFilter, setStatusFilter] = useState<string>('All');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const allRows = [1, 2, 3, 4, 5];
	const allSelected = allRows.every((row) => selectedRows.has(row));
	const someSelected = selectedRows.size > 0 && !allSelected;

	const tableData = [
		{
			metric: 'Response Time',
			value: '210ms',
			trend: '+8,2 %',
			status: 'Normal',
			semantic: 'successful',
			notes: 'Within expected range',
		},
		{
			metric: 'Current Load',
			value: '43 %',
			trend: '-5,4 %',
			status: 'Normal',
			semantic: 'successful',
			notes: 'Auto-scaling not required',
		},
		{
			metric: 'Error Rate',
			value: '0,92 %',
			trend: '+0,71 %',
			status: 'Critical',
			semantic: 'critical',
			notes: 'High failure rate detected',
		},
		{
			metric: 'Active Sessions',
			value: '2.830',
			trend: '+2,1 %',
			status: 'Normal',
			semantic: 'successful',
			notes: 'Consistent usage pattern',
		},
		{
			metric: 'Troughput',
			value: '19.600 req/min',
			trend: '+ 12,8 %',
			status: 'Warning',
			semantic: 'warning',
			notes: 'Higher variability',
		},
	];

	const toggleRow = (rowIndex: number) => {
		setSelectedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(rowIndex)) {
				newSet.delete(rowIndex);
			} else {
				newSet.add(rowIndex);
			}
			return newSet;
		});
	};

	const toggleAll = () => {
		if (allSelected) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(allRows));
		}
	};

	const filteredData = tableData
		.filter((item) => statusFilter === 'All' || item.status === statusFilter)
		.filter(
			(item) =>
				item.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.notes.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.sort((a, b) => {
			if (sortOrder === 'asc') {
				return a.metric.localeCompare(b.metric);
			} else {
				return b.metric.localeCompare(a.metric);
			}
		});

	return (
		<>
			<DBStack gap="sm">
				<DBStack direction="row" justifyContent="space-between" gap="sm">
					<DBInput
						label="Search"
						placeholder="Search..."
						value={searchQuery}
						variant="floating"
						onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
					/>
					<DBStack direction="row" gap="sm">
						<DBSelect
							label="Status"
							value={statusFilter}
							variant="floating"
							onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
						>
							<option value="All">All Status</option>
							<option value="Normal">Normal</option>
							<option value="Warning">Warning</option>
							<option value="Critical">Critical</option>
						</DBSelect>
						<DBButton
							variant="filled"
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
						>
							<DBIcon icon={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} /> Sort Metric
						</DBButton>
					</DBStack>
				</DBStack>
				<div
					style={{
						overflowX: 'auto',
						width: '100%',
						border:
							'var(--db-border-width-3xs) solid var(--db-adaptive-on-bg-basic-emphasis-60-default)',
						borderRadius: 'var(--db-border-radius-md)',
					}}
				>
					<table>
						<thead>
							<tr>
								<th>
									<DBCheckbox
										checked={allSelected}
										indeterminate={someSelected}
										onChange={toggleAll}
									/>
								</th>
								<th>Metric</th>
								<th>Value</th>
								<th>Trend</th>
								<th>Status</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{filteredData.map((item, index) => (
								<tr
									key={index}
									className={selectedRows.has(index + 1) ? 'selected' : ''}
									onClick={(e) => {
										if ((e.target as HTMLElement).closest('td:first-child')) return;
										toggleRow(index + 1);
									}}
								>
									<td>
										<DBCheckbox
											checked={selectedRows.has(index + 1)}
											onChange={() => toggleRow(index + 1)}
										/>
									</td>
									<td>{item.metric}</td>
									<td>{item.value}</td>
									<td>{item.trend}</td>
									<td>
										<DBBadge size="medium" semantic={item.semantic as any}>
											{item.status}
										</DBBadge>
									</td>
									<td>{item.notes}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</DBStack>
		</>
	);
};

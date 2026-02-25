import {
	DBBadge,
	DBCheckbox,
	DBButton,
	DBSelect,
	DBInput,
	DBStack,
} from '@db-ux/react-core-components';
import { useState } from 'react';
import './SelectableTable.css';

export const SelectableTable = () => {
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [statusFilter, setStatusFilter] = useState<string>('All');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
			metric: 'Throughput',
			value: '19.600 req/min',
			trend: '+ 12,8 %',
			status: 'Warning',
			semantic: 'warning',
			notes: 'Higher variability',
		},
	];

	const toggleRow = (metric: string) => {
		setSelectedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(metric)) {
				newSet.delete(metric);
			} else {
				newSet.add(metric);
			}
			return newSet;
		});
	};

	const toggleAll = () => {
		if (filteredData.every((item) => selectedRows.has(item.metric))) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(filteredData.map((item) => item.metric)));
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
							iconLeading={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
						>
							Sort Metric
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
										label="Select all"
										checked={filteredData.length > 0 && filteredData.every((item) => selectedRows.has(item.metric))}
										indeterminate={selectedRows.size > 0 && !filteredData.every((item) => selectedRows.has(item.metric))}
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
							{filteredData.map((item) => (
								<tr
									key={item.metric}
									className={selectedRows.has(item.metric) ? 'selected' : ''}
									onClick={(e) => {
										if ((e.target as HTMLElement).closest('td:first-child')) return;
										toggleRow(item.metric);
									}}
								>
									<td>
										<DBCheckbox
											label={`Select ${item.metric}`}
											checked={selectedRows.has(item.metric)}
											onChange={() => toggleRow(item.metric)}
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

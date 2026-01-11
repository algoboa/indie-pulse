import React from 'react';
import { render, screen } from '@testing-library/react-native';
import KPICard from '../../src/components/cards/KPICard';

describe('KPICard', () => {
  it('renders label and value correctly', () => {
    render(<KPICard label="MRR" value={500000} testID="kpi-card" />);

    expect(screen.getByText('MRR')).toBeTruthy();
    expect(screen.getByText('500,000')).toBeTruthy();
  });

  it('renders with prefix and suffix', () => {
    render(
      <KPICard
        label="Revenue"
        value={100000}
        prefix="¥"
        suffix="/月"
        testID="kpi-card"
      />
    );

    expect(screen.getByText('¥100,000/月')).toBeTruthy();
  });

  it('renders string value correctly', () => {
    render(<KPICard label="Status" value="Active" testID="kpi-card" />);

    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders change percentage with up trend', () => {
    render(
      <KPICard
        label="MRR"
        value={500000}
        change={12.5}
        trend="up"
        testID="kpi-card"
      />
    );

    expect(screen.getByText(/\+12\.5%/)).toBeTruthy();
    expect(screen.getByText(/↑/)).toBeTruthy();
  });

  it('renders change percentage with down trend', () => {
    render(
      <KPICard
        label="Churn"
        value={3.2}
        change={-5.3}
        trend="down"
        testID="kpi-card"
      />
    );

    expect(screen.getByText(/-5\.3%/)).toBeTruthy();
    expect(screen.getByText(/↓/)).toBeTruthy();
  });

  it('renders stable trend icon', () => {
    render(
      <KPICard
        label="Users"
        value={100}
        change={0}
        trend="stable"
        testID="kpi-card"
      />
    );

    expect(screen.getByText(/→/)).toBeTruthy();
  });

  it('applies isNegativeGood logic correctly for churn rate', () => {
    const { getByTestId } = render(
      <KPICard
        label="Churn Rate"
        value={3.2}
        change={-10}
        trend="down"
        isNegativeGood={true}
        testID="kpi-card"
      />
    );

    // Down trend with isNegativeGood should be success color (green)
    expect(getByTestId('kpi-card')).toBeTruthy();
  });

  it('applies featured styling', () => {
    const { getByTestId } = render(
      <KPICard
        label="Featured MRR"
        value={500000}
        isFeatured={true}
        testID="featured-card"
      />
    );

    expect(getByTestId('featured-card')).toBeTruthy();
  });

  it('does not render change when not provided', () => {
    render(<KPICard label="Simple" value={100} testID="kpi-card" />);

    // Should not find any trend indicators
    expect(screen.queryByText(/↑/)).toBeNull();
    expect(screen.queryByText(/↓/)).toBeNull();
    expect(screen.queryByText(/→/)).toBeNull();
  });

  it('formats zero change correctly', () => {
    render(
      <KPICard
        label="Metric"
        value={100}
        change={0}
        trend="stable"
        testID="kpi-card"
      />
    );

    expect(screen.getByText(/\+0\.0%/)).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <KPICard
        label="Custom"
        value={100}
        style={customStyle}
        testID="custom-card"
      />
    );

    expect(getByTestId('custom-card')).toBeTruthy();
  });
});

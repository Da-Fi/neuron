const fixtures = [
  {
    shannons: `123`,
    expected: `0.00000123`,
  },
  {
    shannons: `12300000`,
    expected: `0.123`,
  },
  {
    shannons: `123000000`,
    expected: `1.23`,
  },
  {
    shannons: `000123000000`,
    expected: `1.23`,
  },
  {
    shannons: `1234567890123456789012345678901234567890123456789012345678901234567890123400000000`,
    expected: `12,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678,901,234`,
  },
  {
    shannons: `12345678901234567890123456789012345678901234567890123456789012345678901234`,
    expected: `123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456.78901234`,
  },
  {
    shannons: `1234567890123456789012345678901234567890123456789012345678901234567890123400`,
    expected: `12,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678.901234`,
  },

  {
    shannons: `-123`,
    expected: `-0.00000123`,
  },
  {
    shannons: `-12300000`,
    expected: `-0.123`,
  },
  {
    shannons: `-123000000`,
    expected: `-1.23`,
  },
  {
    shannons: `-000123000000`,
    expected: `-1.23`,
  },
  {
    shannons: `-1234567890123456789012345678901234567890123456789012345678901234567890123400000000`,
    expected: `-12,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678,901,234`,
  },
  {
    shannons: `-12345678901234567890123456789012345678901234567890123456789012345678901234`,
    expected: `-123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456.78901234`,
  },
  {
    shannons: `-1234567890123456789012345678901234567890123456789012345678901234567890123400`,
    expected: `-12,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678.901234`,
  },
  {
    shannons: `0`,
    expected: `0`,
  },
  {
    shannons: `-0`,
    expected: `0`,
  },
  {
    shannons: ``,
    expected: `0`,
  },
]
export default fixtures

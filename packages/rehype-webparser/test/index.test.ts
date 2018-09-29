import parse from '../index'

test('Simple', () => {
  const parser: any = {}
  parse.bind(parser)()

  expect(parser.Parser).toBeInstanceOf(Function)
})

export default (_, res) => {
  res.setHeader('content-type', 'text/plain');
  res.end('axero file-based routing\n');
};

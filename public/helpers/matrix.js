function sum(A, B) {
  var C = new Array(A.length)
  for (let i = 0; i < A.length; i++) {
    C[i] = new Array(A[i].length)
    for (let j = 0; j < A[i].length; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C
}

function multiply(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
    bNumRows = b.length, bNumCols = b[0].length,
    m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function multByScalar(s, M) {
  var A = new Array(M.length)
  for (let i = 0; i < M.length; i++) {
    A[i] = new Array(M[i].length)
    for (let j = 0; j < M[i].length; j++) {
      A[i][j] = s*M[i][j];
    }
  }
  return A
}

export {
  sum,
  multiply,
  multByScalar
}
#include <vector>
#include <map>
#include <algorithm>

std::vector<int> cl(24);
std::vector<std::vector<int>> comb720;
std::map< size_t, std::vector< std::vector<int> > > setComb;

void print(const std::vector<std::vector<int>>& v) {
  for (auto& x : v) {
    for (auto& y : x) {
      std::cout << y << " ";
    }
    std::cout << "\n";
  }
  std::cout << "\n--------------\n";
}

bool validCluesmVerticaly(
  const std::vector<std::vector<int>>& v,
  size_t j
) {

  int cnt = 0;
  int max = 0;
  int up = cl[j];
  int down = cl[17 - j];
  if (up != 0) {
    for (size_t ii = 0; ii < 6; ++ii) {
      if (v[ii][j] > max) {
        max = v[ii][j];
        ++cnt;
      }
    }
    if (cnt != up) return true;
  }

  if (down != 0) {
    cnt = 0;
    max = 0;
    for (size_t ii = 0; ii < 6; ++ii) {
      if (v[5 - ii][j] > max) {
        max = v[5 - ii][j];
        ++cnt;
      }
    }
    if (cnt != down) return true;
  }
  return false;
}

bool validCluesmHorizontaly(
  const std::vector<std::vector<int>>& v,
  size_t i
) {

  int cnt = 0;
  int max = 0;
  int left = cl[23 - i];
  int right = cl[6 + i];

  if (left != 0) {
    cnt = 0;
    max = 0;
    for (size_t jj = 0; jj < 6; ++jj) {
      if (v[i][jj] > max) {
        max = v[i][jj];
        ++cnt;
      }
    }
    if (cnt != left) return true;
  }

  if (right != 0) {
    cnt = 0;
    max = 0;
    for (size_t jj = 0; jj < 6; ++jj) {
      if (v[i][5 - jj] > max) {
        max = v[i][5 - jj];
        ++cnt;
      }
    }
    if (cnt != right) return true;
  }

  return false;
}

bool validRepeat(const std::vector<int>& v) {
  for (size_t ii = 0; ii < v.size() - 1; ++ii) {
    if (v[ii] == v[v.size() - 1]) return true;
  }

  return false;
}

bool validCluesmHorizontaly(const std::vector<int>& v, int left, int right) {

  int cnt = 0;
  int max = 0;

  if (left != 0) {
    cnt = 0;
    max = 0;
    for (size_t jj = 0; jj < 6; ++jj) {
      if (v[jj] > max) {
        max = v[jj];
        ++cnt;
      }
    }
    if (cnt != left) return true;
  }

  if (right != 0) {
    cnt = 0;
    max = 0;
    for (size_t jj = 0; jj < 6; ++jj) {
      if (v[5 - jj] > max) {
        max = v[5 - jj];
        ++cnt;
      }
    }
    if (cnt != right) return true;
  }

  return false;
}

std::vector<int> generateComb(
  std::vector<std::vector<int>>& mainComb, 
  std::vector<int> comb, 
  int left, 
  int right
) {
  if (comb.size() == 6) {
    if (!validCluesmHorizontaly(comb, left, right)) {
      return comb;
    }
    else return {};
  }

  for (int num = 1; num <= 6; ++num) {
    comb.push_back(num);
    if (!validRepeat(comb)) {
      std::vector<int> v = generateComb(mainComb, comb, left, right);
      if (!v.empty())
        mainComb.push_back(v);
    }
    comb.pop_back();
  }

  return {};
}

void fillHorizontaly(std::vector<std::vector<int>>& v, const std::vector<int>& x, size_t i) {
  for (size_t jj = 0; jj < x.size(); ++jj) {
    v[i][jj] = x[jj];
  }
}

void fillVerticaly(std::vector<std::vector<int>>& v, const std::vector<int>& x, size_t j) {
  for (size_t ii = 0; ii < x.size(); ++ii) {
    v[ii][j] = x[ii];
  }
}

bool checkVerticaly(std::vector<std::vector<int>>& v, const std::vector<int>& x, size_t i) {
  for (size_t jj = 0; jj < v.size(); ++jj) {
    for (size_t ii = 0; ii < v.size(); ++ii) {
      if (ii != i && v[ii][jj] == x[jj])
        return false;
    }
  }
  return true;
}

bool checkHorizontaly(std::vector<std::vector<int>>& v, const std::vector<int>& x, size_t j) {
  for (size_t ii = 0; ii < v.size(); ++ii) {
    for (size_t jj = 0; jj < v.size(); ++jj) {
      if (jj != j && v[ii][jj] == x[ii])
        return false;
    }
  }
  return true;
}

bool find(const std::vector<int>& idx, int val) {
  for (auto& x : idx) {
    if (x == val) return true;
  }
  return false;
}

int getIdxComb(const std::vector<int>& idx) {
  int min = INT_MAX;
  int i = -1;
  for (auto& x : setComb) {
    int size = x.second.size();
    if (x.second.back().back() == 720) {
      size = 720;
    }
    if (size < min && !find(idx, x.first)) {
      min = size;
      i = x.first;
    }
  }
  return i;
}

std::vector<std::vector<int>> generateX(std::vector<std::vector<int>> v, int i, std::vector<int> idx) {
  if (i == -1) return v;

  idx.push_back(i);
  auto setIt = setComb[i];
  if (setIt.back().back() == 720)
    setIt = comb720;

  for (auto& x : setIt) {
    if (checkVerticaly(v, x, i)) {
      fillHorizontaly(v, x, i);
      auto tv = generateX(v, getIdxComb(idx), idx);
      if (!tv.empty()) {
        bool valid = true;
        for (size_t ii = 0; ii < v.size(); ++ii) {
          if (validCluesmVerticaly(tv, ii)) {
            valid = false;
            break;
          }
        }
        if (valid) return tv;
      }
    }
  }
  return {};
}

std::vector<std::vector<int>> generateY(std::vector<std::vector<int>> v, int j, std::vector<int> idx) {
  if (j == -1) return v;

  idx.push_back(j);
  auto setIt = setComb[j];
  if (setIt.back().back() == 720)
    setIt = comb720;

  for (auto& x : setIt) {
    if (checkHorizontaly(v, x, j)) {
      fillVerticaly(v, x, j);
      auto tv = generateY(v, getIdxComb(idx), idx);
      if (!tv.empty()) {
        bool valid = true;
        for (size_t jj = 0; jj < v.size(); ++jj) {
          if (validCluesmHorizontaly(tv, jj)) {
            valid = false;
            break;
          }
        }
        if (valid) return tv;
      }
    }
  }
  return {};
}

std::vector<std::vector<int>> SolvePuzzle(const std::vector<int>& clues) {

  cl = clues;
  std::vector<std::vector<int>> res(6);
  for (auto& x : res) x.resize(6);

  if (comb720.empty()) {
    auto v = generateComb(comb720, {}, 0, 0);
  }

  setComb.clear();
  int sumVert = 0;
  int sumHoriz = 0;
  for (size_t ii = 0; ii < 6; ++ii) {
    sumHoriz += cl[23 - ii] + cl[6 + ii];
    sumVert += cl[ii] + cl[17 - ii];
  }

  if (sumHoriz >= sumVert) {
    for (size_t ii = 0; ii < 6; ++ii) {
      std::vector<std::vector<int>> mainComb;
      if (cl[23 - ii] == 0 && cl[6 + ii] == 0) {
        mainComb.push_back({ 720 });
      }
      else
        auto v = generateComb(mainComb, {}, cl[23 - ii], cl[6 + ii]);
      setComb[ii] = mainComb;
    }
    int min = getIdxComb({});
    res = generateX(res, min, {});
  }
  else {
    for (size_t ii = 0; ii < 6; ++ii) {
      std::vector<std::vector<int>> mainComb;
      if (cl[ii] == 0 && cl[17 - ii] == 0) {
        mainComb.push_back({ 720 });
      }
      else
        auto v = generateComb(mainComb, {}, cl[ii], cl[17 - ii]);
      setComb[ii] = mainComb;
    }
    int min = getIdxComb({});
    res = generateY(res, min, {});
  }

  return res;
}
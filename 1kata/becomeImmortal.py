def elder_age(m,n,l,t,s=0):
    if m > n: m, n = n, m
    if m < 2 or not n & (n - 1): # n is a power of 2
        s, p = max(s-l, 0), max(n+s-l-1, 0)
        return (p - s + 1) * (s + p) // 2 * m % t
    p = 1 << n.bit_length() - 1 # Biggest power of 2 lesser than n
    if m < p: return (elder_age(m, p, l, t, s) + elder_age(m, n-p, l, t, s+p)) % t
    return (elder_age(p, p, l, t, s) + elder_age(m-p, n-p, l, t, s) +
            elder_age(p, n-p, l, t, s+p) + elder_age(m-p, p, l, t, s+p)) % t
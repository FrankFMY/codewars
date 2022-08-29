def triangle(row):

    def reduce(a, b):
        return a if a == b else (set('RGB') - {a , b}).pop()

    def walk(offset, root, depth):
        return row[root] if not depth else curry(offset, root, *divmod(depth, 3))

    def curry(offset, root, depth, degree):
        return walk(3 * offset, root, depth) if not degree \
            else reduce(curry(offset, root, depth, degree - 1), curry(offset, root + offset, depth, degree - 1))

    return walk(1, 0, len(row) - 1)
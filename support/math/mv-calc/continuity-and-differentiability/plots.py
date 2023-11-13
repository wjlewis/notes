import numpy as np
import matplotlib.pyplot as plt


def f(x, y):
    if x == 0 or y == 0:
        return 0
    else:
        return (x**2 * y) / (x**4 + y**2)


x = np.linspace(-2, 2, 50)
y = np.linspace(-2, 2, 50)
X, Y = np.meshgrid(x, y)

Z = np.vectorize(f)(X, Y)

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

surf = ax.plot_surface(X, Y, Z, cmap="cool")

plt.show()

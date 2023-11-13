import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)

X, Y = np.meshgrid(x, y)


def f(x, y):
    return x**2 + y**2


Z = f(X, Y)

fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection="3d")


ax.plot_surface(X, Y, Z, color="#7777")


def f_at_y1(x):
    return f(x, 1)


Z1 = f_at_y1(x)
ax.plot(x, np.full((100), 1), Z1, color="orange")

plt.xlabel("X")
plt.ylabel("Y")
plt.show()

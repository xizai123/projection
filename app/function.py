#coding=utf-8
import numpy as np
def get_Rotation_matrix(m):
    S=np.random.randn(m,m)
    Q,R=np.linalg.qr(S)
    W=numpy.diag(numpy.sign(numpy.diag(R)))
    T=np.dot(Q,W)
    return T

def get_Base_vector(m):
    ret = np.ones((m,1))
    return ret

def get_Sampling_vector(n,m):  # 采样得到基向量集合
    base_vector = self.get_Base_vector(m)
    ret = []
    for i in range(n):
        T1 = get_Rotation_matrix()
        vector1 = np.dot(T1, base_vector)
        T2 = get_Rotation_matrix()
        vector2 = np.dot(T2, base_vector)
        vector = numpy.hstack((vector1, vector2))
        q, r = np.linalg.qr(vector)
        vector = np.transpose(q)
        ret.append(vector)
    return ret
def get_Sampling_data(sample_size,dimension,data):
    ret=[]
    Vectors=get_Sampling_vector(sample_size,dimension)
    for i in Vectors:
        i=np.transpose(i)
        data=np.dot(data,i)
        ret.append(data)
    return ret
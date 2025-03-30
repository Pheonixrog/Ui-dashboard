'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  
  useFrame(() => {
    if (!mesh.current) return
    mesh.current.rotation.x += 0.003
    mesh.current.rotation.y += 0.002
  })

  const temp = new THREE.Object3D()
  const positions = [...Array(count)].map(() => {
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    )
    const scale = Math.random() * 0.3 + 0.1
    
    return { position, scale }
  })

  useEffect(() => {
    if (!mesh.current) return
    
    positions.forEach(({ position, scale }, i) => {
      temp.position.set(position.x, position.y, position.z)
      temp.scale.set(scale, scale, scale)
      temp.updateMatrix()
      mesh.current?.setMatrixAt(i, temp.matrix)
    })
    
    mesh.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#6c5ce7" />
    </instancedMesh>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed -z-10 w-full h-full opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  )
} 
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
    const interval = setInterval(() => {
      if (!mesh.current) return

      for (let i = 0; i < positions.length; i++) {
        const x = positions[i].position.x
        const y = positions[i].position.y
        const z = positions[i].position.z

        temp.position.set(x, y, z)
        temp.scale.set(positions[i].scale, positions[i].scale, positions[i].scale)
        temp.updateMatrix()
        mesh.current?.setMatrixAt(i, temp.matrix)
      }

      mesh.current.instanceMatrix.needsUpdate = true
    }, 10)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, temp])

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
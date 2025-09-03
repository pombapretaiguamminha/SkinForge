export interface OBJVertex {
  x: number;
  y: number;
  z: number;
}

export interface OBJFace {
  vertices: number[];
  textureCoords?: number[];
  normals?: number[];
}

export interface OBJData {
  vertices: OBJVertex[];
  faces: OBJFace[];
  textureCoords: Array<{ u: number; v: number }>;
  normals: OBJVertex[];
}

export function parseOBJ(content: string): OBJData {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  
  const vertices: OBJVertex[] = [];
  const textureCoords: Array<{ u: number; v: number }> = [];
  const normals: OBJVertex[] = [];
  const faces: OBJFace[] = [];

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const command = parts[0];

    switch (command) {
      case 'v': // Vertex
        if (parts.length >= 4) {
          vertices.push({
            x: parseFloat(parts[1]),
            y: parseFloat(parts[2]),
            z: parseFloat(parts[3])
          });
        }
        break;

      case 'vt': // Texture coordinate
        if (parts.length >= 3) {
          textureCoords.push({
            u: parseFloat(parts[1]),
            v: parseFloat(parts[2])
          });
        }
        break;

      case 'vn': // Normal
        if (parts.length >= 4) {
          normals.push({
            x: parseFloat(parts[1]),
            y: parseFloat(parts[2]),
            z: parseFloat(parts[3])
          });
        }
        break;

      case 'f': // Face
        const face: OBJFace = {
          vertices: [],
          textureCoords: [],
          normals: []
        };

        for (let i = 1; i < parts.length; i++) {
          const vertexData = parts[i].split('/');
          
          // Vertex index (1-based in OBJ, convert to 0-based)
          if (vertexData[0]) {
            const vertexIndex = parseInt(vertexData[0]);
            face.vertices.push(vertexIndex > 0 ? vertexIndex - 1 : vertices.length + vertexIndex);
          }
          
          // Texture coordinate index
          if (vertexData[1]) {
            const texIndex = parseInt(vertexData[1]);
            face.textureCoords?.push(texIndex > 0 ? texIndex - 1 : textureCoords.length + texIndex);
          }
          
          // Normal index
          if (vertexData[2]) {
            const normalIndex = parseInt(vertexData[2]);
            face.normals?.push(normalIndex > 0 ? normalIndex - 1 : normals.length + normalIndex);
          }
        }

        faces.push(face);
        break;
    }
  }

  return {
    vertices,
    faces,
    textureCoords,
    normals
  };
}

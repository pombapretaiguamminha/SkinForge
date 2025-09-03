import { OBJData, OBJVertex } from './obj-parser';

export interface BlockbenchBone {
  name: string;
  parent?: string;
  pivot: [number, number, number];
  cubes?: BlockbenchCube[];
}

export interface BlockbenchCube {
  origin: [number, number, number];
  size: [number, number, number];
  uv: [number, number];
  mirror?: boolean;
}

export interface BlockbenchGeometry {
  format_version: string;
  [key: string]: {
    texturewidth: number;
    textureheight: number;
    visible_bounds_width: number;
    visible_bounds_height: number;
    visible_bounds_offset: [number, number, number];
    bones: BlockbenchBone[];
  } | string;
}

export function convertToBlockbench(objData: OBJData, modelName: string): BlockbenchGeometry {
  const { vertices } = objData;
  
  if (vertices.length === 0) {
    throw new Error("No vertices found in OBJ data");
  }

  // Calculate bounding box
  const bounds = calculateBounds(vertices);
  const center = {
    x: (bounds.min.x + bounds.max.x) / 2,
    y: (bounds.min.y + bounds.max.y) / 2,
    z: (bounds.min.z + bounds.max.z) / 2
  };

  // Scale to reasonable Minecraft dimensions
  const maxDimension = Math.max(
    bounds.max.x - bounds.min.x,
    bounds.max.y - bounds.min.y,
    bounds.max.z - bounds.min.z
  );
  const scale = Math.min(16 / maxDimension, 1);

  // Create simplified cube representation
  const scaledBounds = {
    min: {
      x: (bounds.min.x - center.x) * scale,
      y: (bounds.min.y - center.y) * scale,
      z: (bounds.min.z - center.z) * scale
    },
    max: {
      x: (bounds.max.x - center.x) * scale,
      y: (bounds.max.y - center.y) * scale,
      z: (bounds.max.z - center.z) * scale
    }
  };

  const width = Math.max(1, Math.ceil(scaledBounds.max.x - scaledBounds.min.x));
  const height = Math.max(1, Math.ceil(scaledBounds.max.y - scaledBounds.min.y));
  const depth = Math.max(1, Math.ceil(scaledBounds.max.z - scaledBounds.min.z));

  const cubes: BlockbenchCube[] = [
    {
      origin: [scaledBounds.min.x, scaledBounds.min.y, scaledBounds.min.z],
      size: [width, height, depth],
      uv: [0, 0]
    }
  ];

  const cleanModelName = modelName.replace(/[^a-zA-Z0-9_]/g, '_');

  return {
    format_version: "1.10.0",
    [`geometry.${cleanModelName}`]: {
      texturewidth: 64,
      textureheight: 64,
      visible_bounds_width: Math.ceil(width / 8),
      visible_bounds_height: Math.ceil(height / 8),
      visible_bounds_offset: [0, Math.ceil(height / 16), 0],
      bones: [
        {
          name: "root",
          pivot: [0, 0, 0]
        },
        {
          name: cleanModelName,
          parent: "root",
          pivot: [0, 0, 0],
          cubes: cubes
        }
      ]
    }
  };
}

function calculateBounds(vertices: OBJVertex[]): { min: OBJVertex; max: OBJVertex } {
  let min = { x: Infinity, y: Infinity, z: Infinity };
  let max = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (const vertex of vertices) {
    min.x = Math.min(min.x, vertex.x);
    min.y = Math.min(min.y, vertex.y);
    min.z = Math.min(min.z, vertex.z);
    max.x = Math.max(max.x, vertex.x);
    max.y = Math.max(max.y, vertex.y);
    max.z = Math.max(max.z, vertex.z);
  }

  return { min, max };
}

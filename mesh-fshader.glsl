#version 300 es
      precision highp float;
      //in vec3 aColor; // colors received from vertex shader
      out vec4 fragColor; // output color of the pixel
      // out float gl_FragDepth;
      uniform float color[3];

      void
      main()
      {
        gl_FragDepth = gl_FragCoord.z;
        fragColor = vec4(gl_FragDepth*(color[0]+1.0), gl_FragDepth*(color[1]+1.0), gl_FragDepth*(color[2]+1.0), 1.0);
      }
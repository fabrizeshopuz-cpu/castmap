package uz.castmap.player.features.splash

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SplashScreen() {
    val transition = rememberInfiniteTransition(label = "goldGlow")
    val alpha by transition.animateFloat(
        initialValue = 0.55f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(900), RepeatMode.Reverse),
        label = "alpha"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0A)),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(18.dp)) {
            Text(
                text = "CM",
                color = Color(0xFFD4AF37).copy(alpha = alpha),
                fontSize = 88.sp,
                fontWeight = FontWeight.Black,
                modifier = Modifier.shadow(28.dp, ambientColor = Color(0xFFD4AF37), spotColor = Color(0xFFD4AF37))
            )
            Text("CASTMAP", color = Color(0xFFF5F5F5), fontSize = 34.sp, fontWeight = FontWeight.Bold)
            Text("CONTROL EVERY SCREEN", color = Color(0xFFD4AF37), fontSize = 16.sp, letterSpacing = 3.sp)
            CircularProgressIndicator(color = Color(0xFFD4AF37))
        }
    }
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== DÉBUT DE LA REQUÊTE ===')

    const requestBody = await req.json()
    console.log('Body reçu:', JSON.stringify(requestBody))

    const { email, password, nom, prenom, role, userToken } = requestBody

    if (!userToken) {
      console.error('❌ Token manquant dans le body')
      throw new Error('Token utilisateur manquant')
    }

    console.log('✅ Token présent, longueur:', userToken.length)

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: `Bearer ${userToken}` }
          }
        }
    )

    console.log('🔍 Vérification de l\'utilisateur...')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError) {
      console.error('❌ Erreur getUser:', userError.message)
      throw new Error(`Token invalide: ${userError.message}`)
    }

    if (!user) {
      console.error('❌ Aucun utilisateur trouvé')
      throw new Error('Non authentifié')
    }

    console.log('✅ User authentifié:', user.id)

    // Vérifier le rôle admin
    console.log('🔍 Vérification du rôle admin...')
    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    console.log('Profile récupéré:', JSON.stringify(profile))

    if (profileError) {
      console.error('❌ Erreur profile:', profileError.message, profileError.code)
      throw new Error(`Erreur profil: ${profileError.message}`)
    }

    if (!profile) {
      console.error('❌ Aucun profil trouvé pour user:', user.id)
      throw new Error('Profil non trouvé')
    }

    console.log('✅ Profil trouvé, rôle:', profile.role)

    if (profile.role !== 'admin') {
      console.error('❌ Rôle insuffisant:', profile.role)
      throw new Error(`Accès refusé : rôle actuel = ${profile.role}`)
    }

    console.log('✅ Utilisateur est admin, création du nouvel utilisateur...')

    // Créer l'utilisateur avec l'API Admin
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (!email || !password || !nom || !prenom || !role) {
      throw new Error('Tous les champs sont requis')
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nom, prenom, role }
    })

    if (error) {
      console.error('❌ Erreur création user:', error.message)
      throw error
    }

    console.log('✅ Utilisateur créé:', data.user.id)

    // Créer le profil
    const { error: profileCreateError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          nom,
          prenom,
          role,
          email
        })

    if (profileCreateError) {
      console.error('❌ Erreur création profile:', profileCreateError.message)
    } else {
      console.log('✅ Profil créé avec succès')
    }

    console.log('=== FIN SUCCÈS ===')

    return new Response(
        JSON.stringify({
          success: true,
          user: data.user
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
    )
  } catch (error) {
    console.error('=== ERREUR GLOBALE ===', error.message)
    return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
    )
  }
})
